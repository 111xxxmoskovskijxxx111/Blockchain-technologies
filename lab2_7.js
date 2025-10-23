
import crypto from "crypto";


function sha256(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}


class MerkleTree {
  constructor(transactions) {
    this.transactions = transactions.map(tx => ({ tx, hash: sha256(JSON.stringify(tx)) }));
    this.treeLevels = [];
    this.buildTree();
  }

  buildTree() {
    let level = this.transactions.map(t => t.hash);
    this.treeLevels.push(level);

    while (level.length > 1) {
      const nextLevel = [];
      for (let i = 0; i < level.length; i += 2) {
        const left = level[i];
        const right = i + 1 < level.length ? level[i + 1] : left; // дублюємо якщо непарне
        nextLevel.push(sha256(left + right));
      }
      level = nextLevel;
      this.treeLevels.push(level);
    }

    this.root = level[0];
  }

  
  getMerkleProof(txId) {
    const index = this.transactions.findIndex(t => t.tx.id === txId);
    if (index === -1) return null;

    let proof = [];
    let idx = index;

    for (let lvl = 0; lvl < this.treeLevels.length - 1; lvl++) {
      const level = this.treeLevels[lvl];
      let isRight = idx % 2;
      let pairIndex = isRight ? idx - 1 : (idx + 1 < level.length ? idx + 1 : idx);
      proof.push({
        hash: level[pairIndex],
        position: isRight ? "left" : "right"
      });
      idx = Math.floor(idx / 2);
    }

    return proof;
  }

 
  static verifyProof(tx, proof, merkleRoot) {
    let hash = sha256(JSON.stringify(tx));
    for (const p of proof) {
      if (p.position === "left") {
        hash = sha256(p.hash + hash);
      } else {
        hash = sha256(hash + p.hash);
      }
    }
    return hash === merkleRoot;
  }
}


const transactions = [
  { id: "tx1", from: "Alice", to: "Bob", amount: 50 },
  { id: "tx2", from: "Charlie", to: "Dave", amount: 25 },
  { id: "tx3", from: "Eve", to: "Frank", amount: 10 }
];

const merkleTree = new MerkleTree(transactions);
console.log("Merkle Root:", merkleTree.root);


const txId = "tx2";
const proof = merkleTree.getMerkleProof(txId);
const tx = transactions.find(t => t.id === txId);
const valid = MerkleTree.verifyProof(tx, proof, merkleTree.root);

console.log("\n=== CASE 1: tx exists ===");
console.log("txId:", txId);
console.log("Proof:", proof);
console.log("Verification result:", valid); 


const tamperedTx = { ...tx, amount: 100 }; 
const validTampered = MerkleTree.verifyProof(tamperedTx, proof, merkleTree.root);

console.log("\n=== CASE 2: tx modified ===");
console.log("txId:", txId);
console.log("Proof:", proof);
console.log("Verification result:", validTampered); 

const fakeTx = { id: "tx999", from: "X", to: "Y", amount: 1 };
const fakeProof = proof; 
const validFake = MerkleTree.verifyProof(fakeTx, fakeProof, merkleTree.root);

console.log("\n=== CASE 3: tx not in block ===");
console.log("txId:", fakeTx.id);
console.log("Proof:", fakeProof);
console.log("Verification result:", validFake);
