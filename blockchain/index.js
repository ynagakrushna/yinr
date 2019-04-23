const Block = require('./block');
const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet');
const { cryptoHash } = require('../util');
const { REWARD_INPUT, MINING_REWARD } = require('../config');

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

  
  replaceChain(chain, validateTransactions ,onSuccess) {
    if (chain.length <= this.chain.length) {
      console.error('The incoming chain must be longer');
      return;
    }

    if (!Blockchain.isValidChain(chain)) {
      console.error('The incoming chain must be valid');
      return;
    }

    if (validateTransactions && !this.validTransactionData({ chain })) {
      console.error('The incoming chain has invalid data');
      return;
    }

    if (onSuccess) onSuccess();
    console.log('replacing chain with', chain);
    this.chain = chain;
  }

  validTransactionData({ chain }) {
    for (let i=1; i<chain.length; i++) {
      const block = chain[i];
      const transactionSet = new Set();
      let rewardTransactionCount = 0;

      for (let transaction of block.data) {
        if (transaction.input.address === REWARD_INPUT.address) {
          rewardTransactionCount += 1;

          if (rewardTransactionCount > 1) {
            console.error('Miner rewards exceed limit');
            return false;
          }

          if (Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
            console.error('Miner reward amount is invalid');
            return false;
          }
        } else {
          if (!Transaction.validTransaction(transaction)) {
            console.error('Invalid transaction');
            return false;
          }

          // calculate wallet balance, based on inputs in the blockchain history.
          const trueBalance = Wallet.calculateBalance({
            chain: this.chain,
            address: transaction.input.address
          });

          if (transaction.input.amount !== trueBalance) {
            console.error('Invalid input amount');
            return false;
          }

          // Prevent Duplicates Transactions in Block
          if (transactionSet.has(transaction)) {
            console.error('An identical transaction appears more than once in the block');
            return false;
          } else {
            transactionSet.add(transaction);
          }
        }
      }
    }

    return true;
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

}

module.exports = Blockchain;