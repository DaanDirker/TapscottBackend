const DonationRoute = require('./DonationRoute');
const PaymentRoute = require('./PaymentRoute');

//Send the Express App as an parameter
module.exports = (app, web3, contract, mollieClient) => {
    DonationRoute(app, web3, contract, mollieClient);
    PaymentRoute(app, web3, contract, mollieClient);
}
