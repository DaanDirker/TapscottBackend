const TransactionRoute = require('./TransactionRoute');
const PaymentRoute = require('./PaymentRoute');

//Send the Express App as an parameter
module.exports = (app, config, web3, contract) => {
    TransactionRoute(app, config, web3, contract);
    PaymentRoute(app, config);
}
