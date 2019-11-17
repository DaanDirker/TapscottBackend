const TransactionRoute = require('./TransactionRoute');
const PaymentRoute = require('./PaymentRoute');

//Send the Express App as an parameter
module.exports = (app, web3, contract, mollieClient) => {
    TransactionRoute(app, web3, contract, mollieClient);
    PaymentRoute(app, mollieClient);
}
