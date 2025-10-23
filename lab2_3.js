// Завдання 3: Колізії у хешуванні (спрощений пошук)
import crypto from "crypto";


function sha256(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}


const base = "student_test";


const n = 4;  


const prefixMap = {};

let nonce = 0;
let found = false;
let attempts = 0;

while (!found) {
  const candidate = base + nonce;
  const hash = sha256(candidate);
  const prefix = hash.slice(0, n); 

  attempts++;

  if (prefixMap[prefix]) {
    
    found = true;
    console.log("=== Колізія знайдена! ===");
    console.log("Кількість спроб до знаходження:", attempts);
    console.log("Рядок 1:", prefixMap[prefix].candidate);
    console.log("Хеш 1  :", prefixMap[prefix].hash);
    console.log("Рядок 2:", candidate);
    console.log("Хеш 2  :", hash);
    console.log("Префікс збігається:", prefix);
  } else {
   
    prefixMap[prefix] = { candidate, hash };
  }

  nonce++;
}
