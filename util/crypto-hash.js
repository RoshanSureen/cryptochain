const crypto = require("crypto");

// returns a SHA256 hash in its hexadecimal form
const cryptoHash = (...inputs) => {
  const hash = crypto.createHash("sha256");
  hash.update(
    inputs
      .map(input => JSON.stringify(input))
      .sort()
      .join(" ")
  );
  return hash.digest("hex");
};

module.exports = cryptoHash;
