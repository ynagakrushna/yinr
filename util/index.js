// Returns an class when accessing ellipticobj.ec property.
const EC = require('elliptic').ec;
const cryptoHash = require('./crypto-hash');

// It uses the prime number to generate the curve and with secp256k1 algorithm that prime number is 256 bits.

// secp256k1 - standards of efficient cryptography, 256 bits, k-koblets contributed mathematician, 1-veryfirst implementation.

const ec = new EC('secp256k1');

const verifySignature = ({ publicKey, data, signature }) => {
  // import a public key
  const keyFromPublic = ec.keyFromPublic(publicKey, 'hex');

  // with the publickey verify the data(outputmap) and signature.
  return keyFromPublic.verify(cryptoHash(data), signature);

};

module.exports = { ec, verifySignature, cryptoHash };