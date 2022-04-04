import Web3 from "web3";
import todoListArtifact from "../../build/contracts/todoList.json";

const App = {
	web3: null,
	account: null,
	meta: null,

	start: async function () {
		const { web3 } = this;

		try {
			// get contract instance
			const networkId = await web3.eth.net.getId();
			const deployedNetwork = todoListArtifact.networks[networkId];
			this.meta = new web3.eth.Contract(
				todoListArtifact.abi,
				deployedNetwork.address
			);

			// get accounts
			const accounts = await web3.eth.getAccounts();
			this.account = accounts[0];
			this.setListeners();
			this.refreshBalance();
		} catch (error) {
			console.error("Could not connect to contract or chain.");
		}
	},

	refreshBalance: async function () {
		const { todosCount } = this.meta.methods;
		const balance = await todosCount().call();

		const balanceElement = document.getElementsByClassName("balance")[0];
		balanceElement.innerHTML = balance;
	},

	createTodo: async function () {
		const content = document.getElementById("content").value;

		this.setStatus("Initiating transaction... (please wait)");

		const { createTodo } = this.meta.methods;
		const res = await createTodo(content).send({ from: this.account });
		console.log(res);

		this.setStatus("Transaction complete!");
		this.refreshBalance();
	},
	markAsDone: async function () {},

	setStatus: function (message) {
		const status = document.getElementById("status");
		status.innerHTML = message;
	},

	setListeners: function () {
		console.log(this.meta);
		this.meta.events.TodoCreated().on("data", (event) => {
			console.log("data", event);
		});
	},
};

window.App = App;

window.addEventListener("load", function () {
	if (window.ethereum) {
		// use MetaMask's provider
		App.web3 = new Web3(window.ethereum);
		window.ethereum.enable(); // get permission to access accounts
	} else {
		console.warn(
			"No web3 detected. Falling back to http://127.0.0.1:7545. You should remove this fallback when you deploy live"
		);
		// fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
		App.web3 = new Web3(
			new Web3.providers.HttpProvider("http://127.0.0.1:7545")
		);
	}

	App.start();
});
