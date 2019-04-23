const Transaction = require('./transaction');
const { STARTING_BALANCE } = require('../config');
const { ec, cryptoHash } = require('../util');

class Wallet {
  constructor() {
    this.balance = STARTING_BALANCE;

    this.keyPair = ec.genKeyPair();

    this.publicKey = this.keyPair.getPublic().encode('hex');
  }

  // data is output map
  sign(data) {
    // data must be hashed before passing to the sign() method.
    return this.keyPair.sign(cryptoHash(data));
  }

  createTransaction({ recipient, amount, chain }) {
    if (chain) {
      this.balance = Wallet.calculateBalance({
        chain,
        address: this.publicKey
      });
    }

    if (amount > this.balance) {
      throw new Error('Amount exceeds balance');
    }

    return new Transaction({ senderWallet: this, recipient, amount });
  }

  // if a wallet conducted a send trnsaction checks in the same or recent block, and takes it wallet balance after sented to recipient(remaining balance), for avoiding adding of past recieved transaction for same wallet, it recieved in the past, so it takes only its remaining balance of wallet after send transaction.
  static calculateBalance({ chain, address }) {
    let hasConductedTransaction = false;
    let outputsTotal = 0;

    for (let i=chain.length-1; i>0; i--) {
      const block = chain[i];

      for (let transaction of block.data) {
        if (transaction.input.address === address) {
          hasConductedTransaction = true;
        }

        const addressOutput = transaction.outputMap[address];

        if (addressOutput) {
          outputsTotal = outputsTotal + addressOutput;
        }
      }

      if (hasConductedTransaction) {
        break;
      }
    }

    return hasConductedTransaction ? outputsTotal : STARTING_BALANCE + outputsTotal;
  }


}


module.exports = Wallet;