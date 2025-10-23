
import Web3 from 'web3';


const web3 = new Web3('http://127.0.0.1:8545');


const contractABI = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_greeting",
          "type": "string"
        }
      ],
      "name": "setGreet",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "greet",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "greeting",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
];



const contractAddress = '0x9d83e140330758a8fFD07F8Bd73e86ebcA8a5692'; 


const contract = new web3.eth.Contract(contractABI, contractAddress);


async function interactWithContract() {
    try {
        
        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
            console.error("Не знайдено акаунтів. Переконайся, що Ganache запущений.");
            return;
        }
        const senderAccount = accounts[0]; 
        console.log(`Використовуємо акаунт: ${senderAccount}`);

        
        console.log("Викликаємо greet()...");
        
        
        const currentGreet = await contract.methods.greet().call();
        console.log(`Поточне привітання: "${currentGreet}"`);

        
        const newGreet = "Hello from Web3.js!";
        console.log(`Встановлюємо нове привітання: "${newGreet}"...`);
        
        
        await contract.methods.setGreet(newGreet).send({ from: senderAccount });
        
        console.log("Привітання успішно змінено!");

        
        console.log("Повторно викликаємо greet() для перевірки...");
        const updatedGreet = await contract.methods.greet().call();
        console.log(`Нове привітання: "${updatedGreet}"`);

    } catch (error) {
        console.error("Сталася помилка:", error.message);
    }
}


interactWithContract();