
import { ethers } from "ethers"; 

async function main() {
  
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

  const accounts = await provider.listAccounts();
  console.log(`Найдено акаунтів: ${accounts.length}\n`);

 
  for (let i = 0; i < accounts.length; i++) {
    const addr = accounts[i].address; 
    const balanceWei = await provider.getBalance(addr);
    const balanceEth = ethers.formatEther(balanceWei);
    console.log(`${i + 1}. ${addr} — ${balanceEth} ETH`);
  }
}

main().catch((err) => {
  console.error("Помилка:", err);
});
