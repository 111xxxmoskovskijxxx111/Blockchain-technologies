
import crypto from "crypto";


function sha256(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}


function merkleRoot(transactions) {
  if (transactions.length === 0) return null;

  
  let level = transactions.map(tx => sha256(JSON.stringify(tx)));

  const treeLevels = [level]; 

  while (level.length > 1) {
    const nextLevel = [];
    for (let i = 0; i < level.length; i += 2) {
      
      const left = level[i];
      const right = i + 1 < level.length ? level[i + 1] : left;
      nextLevel.push(sha256(left + right));
    }
    level = nextLevel;
    treeLevels.push(level);
  }

  return { root: level[0], treeLevels };
}


class Block {
  constructor(transactions, prevHash = "") {
    this.prevHash = prevHash;
    this.timestamp = Date.now();
    this.transactions = transactions;

    const { root, treeLevels } = merkleRoot(transactions);
    this.merkleRoot = root;
    this.treeLevels = treeLevels;

    this.hash = this.computeHash();
  }

  computeHash() {
    return sha256(this.prevHash + this.timestamp + this.merkleRoot);
  }
}


class Blockchain {
  constructor() {
    this.chain = [];
  }

  addBlock(transactions) {
    const prevHash = this.chain.length > 0 ? this.chain[this.chain.length - 1].hash : "0".repeat(64);
    const block = new Block(transactions, prevHash);
    this.chain.push(block);
    return block;
  }
}


const myChain = new Blockchain();


const transactions1 = [
  { from: "Alice", to: "Bob", amount: 50 },
  { from: "Charlie", to: "Dave", amount: 25 },
  { from: "Eve", to: "Frank", amount: 10 }
];

const block1 = myChain.addBlock(transactions1);

console.log("=== Block 1 ===");
console.log("Transactions:", block1.transactions);
console.log("Merkle Root:", block1.merkleRoot);
console.log("Tree Levels:");
block1.treeLevels.forEach((lvl, idx) => console.log(`Level ${idx}:`, lvl));
console.log("Block Hash:", block1.hash);
console.log();


const tamperedTx = [...transactions1];
tamperedTx[0].amount = 100; 
const tamperedBlock = new Block(tamperedTx, block1.prevHash);

console.log("=== Block 1 (transac. changed) ===");
console.log("Transactions:", tamperedBlock.transactions);
console.log("Merkle Root:", tamperedBlock.merkleRoot);
console.log("Block Hash:", tamperedBlock.hash);
console.log();


console.log("=== Chain Validity Check ===");
const valid = block1.hash === tamperedBlock.hash;
console.log("Block valid after transaction change?", valid ? "" : " (невалідний, меркле хеш змінився)");
