const EC = require("elliptic").ec;
const cryptoHash = require("./crypto-hash");

// Create and initialize EC context
const ec = new EC("secp256k1");

const verifySignature = ({ publicKey, data, signature }) => {
  const keyFromPublic = ec.keyFromPublic(publicKey, "hex");
  return keyFromPublic.verify(cryptoHash(data), signature);
};

module.exports = { ec, verifySignature, cryptoHash };
