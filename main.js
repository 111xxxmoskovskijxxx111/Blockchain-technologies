import crypto from "crypto";
// лаба 2
// ---------------------------
// 1. Клас Валідатора
// ---------------------------
class Validator {
  constructor(name, stake) {
    this.name = name;   // Ідентифікатор валідатора
    this.stake = stake; // Кількість монет у ставці
  }
}

// ---------------------------
// 2. Вибір валідатора
// ---------------------------
function selectValidator(validators) {
  const totalStake = validators.reduce((sum, v) => sum + v.stake, 0);
  let rand = Math.random() * totalStake;

  for (let validator of validators) {
    rand -= validator.stake;
    if (rand < 0) return validator;
  }
}

// ---------------------------
// 3. Клас Блоку
// ---------------------------
class Block {
  constructor(index, timestamp, data, previousHash, validator) {
    this.index = index;               // Номер блоку
    this.timestamp = timestamp;       // Час створення
    this.data = data;                 // Дані
    this.previousHash = previousHash; // Хеш попереднього блоку
    this.validator = validator;       // Хто створив блок
    this.hash = this.calculateHash(); // Поточний хеш
  }

  calculateHash() {
    return crypto
      .createHash("sha256")
      .update(
        this.index +
        this.timestamp +
        JSON.stringify(this.data) +
        this.previousHash +
        this.validator.name
      )
      .digest("hex");
  }
}

// ---------------------------
// 4. Клас Blockchain
// ---------------------------
class Blockchain {
  constructor(validators) {
    this.chain = [];
    this.validators = validators;
    this.createGenesisBlock();
  }

  createGenesisBlock() {
    const genesisValidator = selectValidator(this.validators);
    const genesisBlock = new Block(
      0,
      Date.now(),
      { msg: "Генезис-блок" },
      "0",
      genesisValidator
    );
    this.chain.push(genesisBlock);
    console.log(`Block 0 validated by ${genesisValidator.name} (stake = ${genesisValidator.stake})`);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(data) {
    const validator = selectValidator(this.validators);
    const newBlock = new Block(
      this.chain.length,
      Date.now(),
      data,
      this.getLatestBlock().hash,
      validator
    );
    this.chain.push(newBlock);
    console.log(`Block ${newBlock.index} validated by ${validator.name} (stake = ${validator.stake})`);
    return validator.name;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];

      if (current.hash !== current.calculateHash()) return false;
      if (current.previousHash !== previous.hash) return false;
    }
    return true;
  }
}

// ---------------------------
// 5. Демонстрація
// ---------------------------
const v1 = new Validator("Alice", 5);
const v2 = new Validator("Bob", 10);
const v3 = new Validator("Charlie", 1);

const validators = [v1, v2, v3];
const myBlockchain = new Blockchain(validators);

// Додаємо мінімум 5 блоків
for (let i = 1; i <= 5; i++) {
  myBlockchain.addBlock({ amount: i * 10 });
}

// Перевірка цілісності
console.log("Чи дійсний блокчейн?", myBlockchain.isChainValid());

// Зламати дані у будь-якому блоці (наприклад, блок 2)
myBlockchain.chain[2].data.amount = 999;
console.log("Після зміни блоку, чи дійсний блокчейн?", myBlockchain.isChainValid());

// Частота перемог валідаторів за 50 блоків
const stats = {};
for (let v of validators) stats[v.name] = 0;

const testBlockchain = new Blockchain(validators);
for (let i = 1; i <= 50; i++) {
  const winner = testBlockchain.addBlock({ amount: i * 5 });
  stats[winner]++;
}

console.log("Частота перемог валідаторів за 50 блоків:");
for (let name in stats) {
  console.log(`${name}: ${stats[name]} (${((stats[name]/50)*100).toFixed(1)}%)`);
}
