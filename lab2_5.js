// lab2_task5.js
// Завдання 5: Симуляція підпису документа та перевірка валідності
import crypto from "crypto";
import fs from "fs/promises";

function signMessage(privateKey, message) {
  return crypto.sign("sha256", Buffer.from(message), privateKey);
}

function verifySignature(publicKey, message, signature) {
  return crypto.verify("sha256", Buffer.from(message), publicKey, signature);
}

async function main() {
  
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
  });

  
  const pubPem = publicKey.export({ type: "pkcs1", format: "pem" });
  const privPem = privateKey.export({ type: "pkcs1", format: "pem" });

  
  const doc = {
    id: "DOC-2025-01",
    content: "Це тестовий документ. Авторизація транзакції №42.",
  };

  
  const docString = JSON.stringify(doc);

 
  const signature = signMessage(privateKey, docString);
  const signatureBase64 = signature.toString("base64");
  const signatureHex = signature.toString("hex");

  
  await fs.writeFile("author_public_key.pem", pubPem, "utf8");
  await fs.writeFile("document_signature.b64", signatureBase64, "utf8");
  
  await fs.writeFile("author_private_key.pem", privPem, "utf8");

  console.log("=== Документ підписано та збережено підпис + public key ===");
  console.log("Документ (id) :", doc.id);
  console.log("Документ (content):", doc.content);
  console.log("Підпис (Base64):", signatureBase64);
  console.log();

  
  
  const isValidA = verifySignature(publicKey, docString, signature);
  console.log("CASE A — справжній документ:");
  console.log("Перевірка:", isValidA ? " Валідний" : " Невалідний");
  console.log();


  const tamperedDoc = { ...doc, content: doc.content + " (підмінено)" };
  const tamperedString = JSON.stringify(tamperedDoc);
  const isValidB = verifySignature(publicKey, tamperedString, signature);
  console.log("CASE B — документ змінено:");
  console.log("Змінений content:", tamperedDoc.content);
  console.log("Перевірка:", isValidB ? " Валідний (НЕПРАВИЛЬНО)" : " Невалідний (очікувано)");
  console.log();

  
  const otherMessage = "Some other message to sign";
  const fakeSignature = signMessage(privateKey, otherMessage); 
  const isValidC = verifySignature(publicKey, docString, fakeSignature);
  console.log("CASE C — підпис підмінено (інший підпис):");
  console.log("Підпис підмінено (Base64):", fakeSignature.toString("base64"));
  console.log("Перевірка:", isValidC ? " Валідний (НЕПРАВИЛЬНО)" : " Невалідний (очікувано)");
  console.log();

  
  console.log("Коротке пояснення:");
  console.log("- Справжній документ з оригінальним підписом проходить перевірку.");
  console.log("- Будь-яка зміна документу (навіть один символ) робить підпис невалідним.");
  console.log("- Якщо підпис підмінено на інший, то теж - невалідний (перевірка провалиться).");
  console.log();
  console.log("Файли записані (симуляція збереження): author_public_key.pem, document_signature.b64, author_private_key.pem");
}

main().catch((err) => {
  console.error("Помилка:", err);
});
