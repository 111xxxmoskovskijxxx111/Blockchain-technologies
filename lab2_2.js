// Завдання 2: Випадковий рядок і стійкість хешу (SHA-256)

import crypto from "crypto";


function generateRandomString(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}


function sha256(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

let randomString = generateRandomString(16);
console.log("Випадковий рядок       :", randomString);


let hash1 = sha256(randomString);
console.log("SHA-256 хеш оригіналу :", hash1);


let indexToChange = Math.floor(Math.random() * randomString.length);
let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
let newChar = chars.charAt(Math.floor(Math.random() * chars.length));
while (newChar === randomString[indexToChange]) {
  newChar = chars.charAt(Math.floor(Math.random() * chars.length));
}


let modifiedString = randomString.slice(0, indexToChange) + newChar + randomString.slice(indexToChange + 1);
console.log("Змінений рядок         :", modifiedString);


let hash2 = sha256(modifiedString);
console.log("SHA-256 хеш зміненої  :", hash2);


let diffCount = 0;
for (let i = 0; i < hash1.length; i++) {
  if (hash1[i] !== hash2[i]) diffCount++;
}

console.log("Кількість відмінних символів у хешах:", diffCount);


