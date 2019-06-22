const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const Blockchain = require("./blockchain");
const PubSub = require("./app/pubsub");
const TransactionPool = require("./wallet/transaction-pool");
const Wallet = require("./wallet");

const app = express();

const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain, transactionPool });

// Define ROOT_NODE address and port
const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

// Middleware
app.use(bodyParser.json());

// ===================================================================================
// API requests
// ===================================================================================
app.get("/api/blocks", (req, res) => {
  res.json(blockchain.chain);
});

app.post("/api/mine", (req, res) => {
  const { data } = req.body;
  blockchain.addBlock({ data });

  pubsub.broadcastChain();
  res.redirect("/api/blocks");
});

app.post("/api/transact", (req, res) => {
  const { amount, recipient } = req.body;

  let transaction = transactionPool.existingTransaction({
    inputAddress: wallet.publicKey
  });
  try {
    if (transaction) {
      transaction.update({ senderWallet: wallet, recipient, amount });
    } else {
      transaction = wallet.createTransaction({ recipient, amount });
    }
  } catch (error) {
    return res.status(400).json({
      confirmation: "fail",
      message: error.message
    });
  }

  transactionPool.setTransaction(transaction);

  res.json({
    confirmation: "success",
    transaction
  });

  pubsub.broadcastTransaction(transaction);
});

app.get("/api/transaction-pool-map", (req, res) => {
  res.json({
    confirmation: "success",
    message: transactionPool.transactionMap
  });
});

// ===================================================================================
// new nodes get latest copy of the longest blockchain in the network
// ===================================================================================
const syncWithRootState = () => {
  request(
    { url: `${ROOT_NODE_ADDRESS}/api/blocks` },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const rootChain = JSON.parse(body);

        console.log("replace chain on a sync with", rootChain);
        blockchain.replaceChain(rootChain);
      }
    }
  );

  request(
    { url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map` },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const rootTransactionPoolMap = JSON.parse(body);

        console.log(
          "replcae transaction pool map on a sync with",
          rootTransactionPoolMap
        );
        transactionPool.setMap(rootTransactionPoolMap);
      }
    }
  );
};

// generate different port number for different nodes in the network
let PEER_PORT;
if (process.env.GENERATE_PEER_PORT === "true") {
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}
const PORT = PEER_PORT || DEFAULT_PORT;

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);

  if (PORT !== DEFAULT_PORT) {
    syncWithRootState();
  }
});
