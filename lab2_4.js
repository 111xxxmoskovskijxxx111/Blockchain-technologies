import crypto from "crypto";


const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
});


const message = "Hello Blockchain";


const signature = crypto.sign("sha256", Buffer.from(message), privateKey);


const isVerified = crypto.verify(
  "sha256",
  Buffer.from(message),
  publicKey,
  signature
);


const tamperedMessage = message + "!";
const isVerifiedTampered = crypto.verify(
  "sha256",
  Buffer.from(tamperedMessage),
  publicKey,
  signature
);


console.log("=== RSA-2048 Підпис повідомлення ===");


console.log("Публічний ключ (скорочено):\n", publicKey.export({ type: 'pkcs1', format: 'pem' }).slice(0, 80) + "...\n");


console.log("Підпис (Base64):", signature.toString("base64"));


console.log("Перевірка підпису (оригінал):", isVerified ? " Валідний" : " Невалідний");
console.log("Перевірка підпису (змінено):", isVerifiedTampered ? " Валідний" : " Невалідний");

