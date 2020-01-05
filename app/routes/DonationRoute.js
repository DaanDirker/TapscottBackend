const source = require('../../utils/Constants');
const decimals = source.decimals;
const divider = source.divider;
const maxTransactions = 20;

module.exports = (app, web3, contract, mollieClient) => {

    //Retrieving newest transactions
    app.get('/transactions/new/:limit', (req, res) => {
        const amount = req.params.limit;

        if (amount > maxTransactions) amount = maxTransactions;
        res.send(amount);
    });

    //Retrieving highest amount donated transactions
    app.get('/transactions/highest/:limit', (req, res) => {
        const amount = req.params.limit;

        if (amount > maxTransactions) amount = maxTransactions;
        res.send(amount);
    });

    // Retrieve transactions of given hashed IBAN
    app.get('/transactions/my', (req, res) => {
        res.send('Your Transactions!');
    });

    //Webhook Endpoint
    app.post('/donation/save', async (req, res) => {
        const paymentId = req.body.id;
        const payment = await mollieClient.payments.get(paymentId);

        if (payment.isPaid()) {
            const { paidAt, metadata } = payment;
            const { value, currency } = payment.amount;
            const { consumerAccount } = payment.details;

            const contractAmountFormat = nonDecimalFormat(value);
            const currentDate = new Date();

            //Inserting Payment details onto smart contract
            contract.methods.addDonation(metadata, consumerAccount, currentDate.toString(), contractAmountFormat)
                .send({ from: web3.eth.defaultAccount }).then(() => {
                    console.log('Succeeded making a donation ' + contractAmountFormat);
                    res.send('Setting number to ' + contractAmountFormat);
                }).catch((err) => {
                    console.log(err.toString());
                    res.send(err.toString());
                });
        }
        res.status(200);
        res.end();
    });

    app.post('/donation/:name/:sender/:amount', (req, res) => {
        const { name, sender, amount } = req.params
        const contractAmountFormat = nonDecimalFormat(amount);
        const timestamp = new Date();

        contract.methods.addDonation(name, sender, timestamp.toString(), contractAmountFormat)
            .send({ from: web3.eth.defaultAccount }).then(() => {
                console.log('Succeeded making a donation of ' + contractAmountFormat);
                res.send('Succeeded making a donation of ' + contractAmountFormat);
            }).catch((err) => {
                console.log(err.toString());
                res.send(err.toString());
            });
    });

    app.get('/donation', (req, res) => {
        contract.methods.getStructDonations().call().then((donations) => {
            let endDonations = [];
            donations.forEach(donation => endDonations.push(formatDonation(donation)));
            res.send(endDonations);
        }).catch((err) => {
            console.log(err.toString());
            res.send(err.toString());
        });
    });

    app.get('/donation/latest', (req, res) => {
        contract.methods.getlatestDonations().call().then((donations) => {
            let endDonations = [];
            donations.forEach(donation => endDonations.push(formatDonation(donation)));
            res.send(endDonations);
        }).catch((err) => {
            console.log(err.toString());
            res.send(err.toString());
        });
    });

    app.get('/donation/sum', (req, res) => {
        contract.methods.calculateTotalDonationAmount().call().then((sum) => {
            const decimalReturn = (sum / 100).toFixed(2);
            console.log('Decimal number = ' + decimalReturn);
            res.send(decimalReturn);
        }).catch((err) => {
            console.log(err.toString());
            res.send(err.toString());
        });
    });

    app.get('/donation/user/:requestedUser', (req, res) => {
        const requestedUser = req.params.requestedUser;

        contract.methods.getUserDonations(requestedUser).call().then((donations) => {
            console.log('Donations of requested user = ' + donations);
            res.send(donations);
        }).catch((err) => {
            console.log(err.toString());
            res.send(err.toString());
        });
    });

    nonDecimalFormat = (value) => Math.round((value * divider));
    decimalFormat = (value) => (value / divider).toFixed(decimals).toString();

    formatDonation = (donation) => {
        return {
            name: donation[0],
            sender: donation[1],
            timestamp: donation[2],
            amount: decimalFormat(donation[3])
        }
    }

}
