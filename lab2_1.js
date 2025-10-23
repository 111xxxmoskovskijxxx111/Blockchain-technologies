// Лабораторна робота №2: Основи програмування Blockchain
// Завдання 1: Генерація SHA-256 та SHA3-256 хешів

import crypto from "crypto";
import CryptoJS from "crypto-js";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Введіть рядок для хешування: ", (input) => {
  const sha256 = crypto.createHash("sha256").update(input).digest("hex");
  const sha3 = CryptoJS.SHA3(input, { outputLength: 256 }).toString();

  console.log("\n=== Результати хешування ===");
  console.log("SHA-256 :", sha256);
  console.log("SHA3-256:", sha3);

  console.log("\nДовжина SHA-256 :", sha256.length);
  console.log("Довжина SHA3-256:", sha3.length);

  console.log("\nВисновок:");
  console.log(
    "✅ SHA-256 — швидший, використовується у Bitcoin.\n" +
    "🔒 SHA3-256 — новіший і надійніший (алгоритм Keccak)."
  );

  rl.close();
});
