const express = require('express');
const Web3 = require('web3');
const app = express();

require('dotenv').config();

let web3;
let contract;

// Setup 2 enviorements: ganache and ropsten testnet
if (process.env.ENVIOREMENT == "ganache") {
    web3 = new Web3(new Web3.providers.HttpProvider("http://" + process.env.GANACHE_HOST 
        + ":" + process.env.GANACHE_PORT));
    
    // Set account 
    web3.eth.getAccounts().then((accounts) => {
        web3.eth.defaultAccount = accounts[0];
    });

    const abi = require('./build/contracts/Testing.json').abi;
    contract = new web3.eth.Contract(abi, process.env.CONTRACT_ADDRESS);
} else if (process.env.ENVIOREMENT == "testnet") {
    web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_ENDPOINT));
} else {
    return;
}

require('./app/routes')(app, web3, contract)

app.listen(process.env.BACKEND_PORT, process.env.BACKEND_HOST, (err) => {
    if (err) console.log(err);
    console.log('Succesfully started backend on port ' + process.env.BACKEND_PORT);
});


