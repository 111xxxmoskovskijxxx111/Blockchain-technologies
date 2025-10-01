import fetch from "node-fetch";

const API_KEY = "JJ4DUIWH8TJEFHT48QPJFYIVKN8DVV41BP";
const BASE_URL = "https://api.etherscan.io/v2/api?chainid=1";

async function getLatestBlockNumber() {
  try {
    const response = await fetch(
      `${BASE_URL}&module=proxy&action=eth_blockNumber&apikey=${API_KEY}`
    );
    const data = await response.json();

    if (!data.result) {
      throw new Error(data.message || "Invalid response");
    }

    return parseInt(data.result, 16);
  } catch (err) {
    console.error("Помилка при отриманні номера блоку:", err.message);
    return null;
  }
}

async function getBlockByNumber(blockNumber) {
  try {
    const blockHex = "0x" + blockNumber.toString(16);
    const response = await fetch(
      `${BASE_URL}&module=proxy&action=eth_getBlockByNumber&tag=${blockHex}&boolean=true&apikey=${API_KEY}`
    );
    const data = await response.json();

    if (data.error) throw new Error(data.error.message);
    if (!data.result) throw new Error("Block not found");

    return data.result;
  } catch (err) {
    console.error(` Помилка при отриманні блоку ${blockNumber}:`, err.message);
    return null;
  }
}

async function main() {
  const latestBlockNumber = await getLatestBlockNumber();
  if (!latestBlockNumber) return;

  console.log(" Останній блок Ethereum:", latestBlockNumber);

  const latestBlock = await getBlockByNumber(latestBlockNumber);
  if (!latestBlock) return;

  const timestamp = parseInt(latestBlock.timestamp, 16);
  const date = new Date(timestamp * 1000);

  console.log(" Номер блоку:", parseInt(latestBlock.number, 16));
  console.log(" Час створення:", date.toString());
  console.log(" Кількість транзакцій:", latestBlock.transactions.length);
  console.log(" Хеш блоку:", latestBlock.hash);
  console.log("Хеш попереднього блоку:", latestBlock.parentHash);

  // середня кількість транзакцій за 5 блоків
  let totalTx = 0;
  let count = 0;
  for (let i = 0; i < 5; i++) {
    const block = await getBlockByNumber(latestBlockNumber - i);
    if (block && block.transactions) {
      totalTx += block.transactions.length;
      count++;
    }
  }
  const avgTx = totalTx / count;
  console.log(" Середня кількість транзакцій за останні 5 блоків:", avgTx.toFixed(2));
}

main();

