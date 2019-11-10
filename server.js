const express = require('express');
const Web3 = require('web3');
const app = express();

//For HTTTPS
// const fs = require('fs')
// const https = require('https')

const config = JSON.parse(JSON.stringify(
    require('./app/config/config')
));

const web3 = new Web3(new Web3.providers
    .HttpProvider("https://ropsten.infura.io/v3/5cb9df6da72948559da0af6a72dc6084"));
web3.eth.defaultAccount = web3.eth.accounts[0];

const contractAddress = config.contract.address;
const ABI = require('./app/config/ABI.json');
const contract = new web3.eth.Contract(ABI, contractAddress);

require('./app/routes')(app, config, web3, contract)

app.listen(config.port, config.hostname, (err) => {
    if (err) console.log(err);
    console.log('Succesfully started backend on port ' + config.port);
});

//FOR HTTPS TESTING WITH SSL CERTS
// https.createServer({
//     key: fs.readFileSync('./app/config/server.key', 'utf8'),
//     cert: fs.readFileSync('./app/config/server.cert', 'utf8')
//   }, app)
//   .listen(config.port, config.hostname, (err) => {
//     if (err) console.log(err);
//     console.log('Succesfully started backend on port ' + config.port);
// });
