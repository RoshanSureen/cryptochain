const Block = require("./block");
const Wallet = require("../wallet");
const { cryptoHash } = require("../util");
const { REWARD_INPUT, MINING_REWARD } = require("../config");
const Transaction = require("../wallet/transaction");

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }) {
    const newBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length - 1],
      data
    });
    this.chain.push(newBlock);
  }

  validTransactionData({ chain }) {
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];

      // collection of unique transactions
      const transactionSet = new Set();

      let rewardTransactionCount = 0;

      for (let transaction of block.data) {
        // check validity of reward transaction
        if (transaction.input.address === REWARD_INPUT.address) {
          rewardTransactionCount += 1;

          // check for multiple rewardTransactions
          if (rewardTransactionCount > 1) {
            console.error("Miner reward exceeds limit");
            return false;
          }

          // check for corrupted outputMap of rewardTransactions
          if (Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
            console.error("Miner reward is invalid");
            return false;
          }
        } else {
          // check validity of regular transaction
          if (!Transaction.validTransaction(transaction)) {
            console.error("Invalid transaction");
            return false;
          }

          const trueBalance = Wallet.calculateBalance({
            chain: this.chain,
            address: transaction.input.address
          });

          // check balance field
          if (transaction.input.amount !== trueBalance) {
            console.error("Invalid input amount");
            return false;
          }

          // check for identical transactions
          if (transactionSet.has(transaction)) {
            console.error(
              "An identical transaction appears more than once in the block"
            );
            return false;
          } else {
            transactionSet.add(transaction);
          }
        }
      }
    }
    return true;
  }

  static isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      const { timestamp, lastHash, hash, data, nonce, difficulty } = chain[i];
      const actualLastHash = chain[i - 1].hash;
      const lastDifficulty = chain[i - 1].difficulty;

      if (lastHash !== actualLastHash) return false;

      const validateHash = cryptoHash(
        timestamp,
        lastHash,
        data,
        nonce,
        difficulty
      );
      if (hash !== validateHash) return false;

      if (Math.abs(lastDifficulty - difficulty) > 1) return false;
    }

    return true;
  }

  // sets the blockchain to the longest chain in the network
  replaceChain(chain, validateTransactions, onSuccess) {
    if (chain.length <= this.chain.length) {
      console.error("The incoming chain must be longer");
      return;
    }

    if (!Blockchain.isValidChain(chain)) {
      console.error("The incoming chain must be valid");
      return;
    }

    if (validateTransactions && !this.validTransactionData({ chain })) {
      console.error("The incoming chain has invalid data");
      return;
    }

    if (onSuccess) onSuccess();
    console.log("replacing chain with", chain);
    this.chain = chain;
  }
}

module.exports = Blockchain;
