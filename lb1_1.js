const crypto = require("crypto");

// клас Block
class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto
      .createHash("sha256")
      .update(
        this.index +
        this.timestamp +
        JSON.stringify(this.data) +
        this.previousHash +
        this.nonce
      )
      .digest("hex");
  }

  mineBlock(difficulty) {
    const prefix = "0".repeat(difficulty);
    console.time(`Блок #${this.index}, час`);
    while (!this.hash.startsWith(prefix)) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.timeEnd(`Блок #${this.index}, час`);
    console.log(`Хеш: ${this.hash}`);
    console.log(`Кількість ітерацій nonce: ${this.nonce}\n`);
  }
}

// Клас Blockchain
class Blockchain {
  constructor(difficulty = 3) {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = difficulty;
  }

  createGenesisBlock() {
    return new Block(0, Date.now().toString(), "Початковий блок", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(data) {
    const newBlock = new Block(
      this.chain.length,
      Date.now().toString(),
      data,
      this.getLatestBlock().hash
    );
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainValid() {
    const prefix = "0".repeat(this.difficulty);
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];
      if (current.previousHash !== previous.hash) return false;
      if (current.hash !== current.calculateHash()) return false;
      if (!current.hash.startsWith(prefix)) return false;
    }
    return true;
  }

  totalNonceIterations() {
    return this.chain.slice(1).reduce((sum, b) => sum + b.nonce, 0);
  }
}

// Класичний майнер
console.log("=== ДЕМО: КЛАСИЧНИЙ МАЙНЕР ===\n");
let demoChain = new Blockchain(3);

demoChain.addBlock({ amount: 10 });
demoChain.addBlock({ amount: 20 });
demoChain.addBlock({ msg: "Text" });

console.log("Чи ланцюг дійсний? →", demoChain.isChainValid());

// Хакер змінює дані
console.log("\n  Злом даних блоку 1...");
demoChain.chain[1].data = "Hacked!";
console.log("Чи ланцюг дійсний після злому? →", demoChain.isChainValid());

console.log("\nЗагальна кількість ітерацій nonce (усі майнінги):", demoChain.totalNonceIterations());

// Альтернативний майнер
class BlockAlt extends Block {
  mineBlockAlt() {
    console.time(`Альтернативний блок #${this.index}, час`);
    while (this.hash[2] !== "3") {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.timeEnd(`Альтернативний блок #${this.index}, час`);
    console.log(`Хеш: ${this.hash}`);
    console.log(`Кількість ітерацій nonce: ${this.nonce}\n`);
  }
}

console.log("\n=== ДЕМО: АЛЬТЕРНАТИВНИЙ МАЙНЕР ===\n");
let altBlock1 = new BlockAlt(4, Date.now().toString(), { test: "alt" }, "0");
altBlock1.mineBlockAlt();

let altBlock2 = new BlockAlt(5, Date.now().toString(), { test: "alt2" }, altBlock1.hash);
altBlock2.mineBlockAlt();

console.log("\n  Злом даних альтернативного блоку #5...");
altBlock2.data = "Hacked!";
console.log("Хеш альтернативного блоку валідний? →", altBlock2.hash === altBlock2.calculateHash()); // false
