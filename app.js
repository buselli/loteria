const web3 = new Web3(Web3.givenProvider);
const LOTTERY_CONTRACT_ADDRESS = "0xc0716A81D3D088c95f20049Eb0F510441E7b7a24";
const LOTTERY_CONTRACT_ABI = [
	{
		"inputs": [],
		"name": "buyTicket",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "maxTickets",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "ownerToTickets",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "ticketCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "ticketPrice",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "ticketToOwner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "token",
		"outputs": [
			{
				"internalType": "contract MyToken",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const connectButton = document.getElementById("connect");
const buyTicketButton = document.getElementById("buyTicket");
const status = document.getElementById("status");

let lotteryContract;
let userAccount;

async function connectMetaMask() {
    try {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        userAccount = accounts[0];
        status.innerText = "Connected: " + userAccount;
        buyTicketButton.disabled = false;

        lotteryContract = new web3.eth.Contract(LOTTERY_CONTRACT_ABI, LOTTERY_CONTRACT_ADDRESS);

        ethereum.on('accountsChanged', (accounts) => {
            userAccount = accounts[0];
            if (userAccount) {
                status.innerText = "Connected: " + userAccount;
            } else {
                status.innerText = "Please connect to MetaMask.";
                buyTicketButton.disabled = true;
            }
            approveButton.disabled = false;

        });

        ethereum.on('disconnect', () => {
            userAccount = null;
            status.innerText = "Disconnected. Please connect to MetaMask.";
            buyTicketButton.disabled = true;
        });

    } catch (error) {
        console.error(error);
        status.innerText = "Error connecting to MetaMask.";
    }
}
async function approveTokenTransfer() {
    try {
        const tokenAmountToApprove = web3.utils.toWei("100"); // Aprovar a transferência de 100 tokens
        const gas = await token.methods.approve(LOTTERY_CONTRACT_ADDRESS, tokenAmountToApprove).estimateGas({ from: userAccount });
        const result = await token.methods.approve(LOTTERY_CONTRACT_ADDRESS, tokenAmountToApprove).send({ from: userAccount, gas });
        status.innerText = "Token transfer approved!";
    } catch (error) {
        console.error(error);
        status.innerText = "Error approving token transfer.";
    }
}
const approveButton = document.getElementById("approve");
approveButton.addEventListener("click", approveTokenTransfer);

async function buyTicket() {
    try {
        const gas = await lotteryContract.methods.buyTicket().estimateGas({ from: userAccount });
        const result = await lotteryContract.methods.buyTicket().send({ from: userAccount, gas });
        status.innerText = "Ticket purchased successfully!";
    } catch (error) {
        console.error(error);
        status.innerText = "Error purchasing ticket.";
    }
}

connectButton.addEventListener("click", connectMetaMask);
buyTicketButton.addEventListener("click", buyTicket);
