const Block = require('./block');
const { cryptoHash } = require('../util');

class Blockchain {
  constructor() {
    // First block in chain is genesis block
    this.chain = [Block.genesis()];
  }

  // Add a new block to chain 
  addBlock({ data }) {
    const newBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length-1],
      data
    });

    this.chain.push(newBlock);
  }

  // Valid chain method
  static isValidChain(chain) {

    // Testing whether chain is started with genesis block.
    if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }

    // check lastHash Reference with in current block is valid or not
    for(let i=1; i<chain.length; i++) {
      // Get the block
      const { timestamp, lastHash, hash, nonce, difficulty, data } = chain[i];

      // take previous block hash
      const actualLastHash = chain[i-1].hash;

      // Last block difficulty and miners current block difficulty greater than 1 returns false
      const lastDifficulty = chain[i-1].difficulty;

      // test lastHash
      if(lastHash !== actualLastHash) return false;

      // Test any fields has changed by creating a hash again for the data
      const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);

      // Test both hashes.
      if(hash !== validatedHash) return false;

      if(Math.abs(lastDifficulty - difficulty) > 1) return false;

    }

    // It is a valid chain.
    return true;
  }

  replaceChain(chain) {

    if(chain.length <= this.chain.length) {
      console.error('The incoming chain must be longer');
      return;
    }

    if (!Blockchain.isValidChain(chain)) {
      console.error('The incoming chain must be valid.');
      return;
    }

    console.log('replacing chain with', chain);
    this.chain = chain;
  }

}

module.exports = Blockchain;