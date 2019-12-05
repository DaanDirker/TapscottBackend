require('dotenv').config();
const express = require('express');
const Web3 = require('web3');
const app = express();
const { createMollieClient } = require('@mollie/api-client');
const bodyParser = require('body-parser');

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(bodyParser.json());

let web3;
let contract;

// Setup 2 enviorements: ganache and ropsten testnet
if (process.env.ENVIRONMENT == "ganache") {
    web3 = new Web3(new Web3.providers.HttpProvider("http://" + process.env.GANACHE_HOST
        + ":" + process.env.GANACHE_PORT));

    // Set default account     
    web3.eth.getAccounts().then((accounts) => {
        web3.eth.defaultAccount = accounts[0];
    });

    const abi = require('./build/contracts/Donations.json').abi;

    // Set contract with transaction limit
    contract = new web3.eth.Contract(abi, process.env.CONTRACT_ADDRESS, {
        gas: 6721975
    });
} else if (process.env.ENVIRONMENT == "testnet") {
    web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_ENDPOINT));
} else {
    return;
}

const mollieClient = createMollieClient({ apiKey: process.env.MOLLIE_TEST_TOKEN });
require('./app/routes')(app, web3, contract, mollieClient);

app.listen(process.env.BACKEND_PORT, process.env.BACKEND_HOST, (err) => {
    if (err) console.log(err);
    console.log('Succesfully started backend on port ' + process.env.BACKEND_PORT);
});
