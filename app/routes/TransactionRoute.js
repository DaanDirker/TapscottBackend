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

    app.post('/transaction/save', async (req, res) => {
        const paymentId = req.body.id;
        const payment = await mollieClient.payments.get(paymentId);

        if (payment.isPaid()) {
            const { paidAt, metadata } = payment;
            const { value, currency } = payment.amount;
            const { consumerAccount } = payment.details;

            console.log("================Payment Details================");
            console.log("Timestamp: " + paidAt + "\n"
                + "User: " + metadata + "\n"
                + "Amount: " + value + " Currency: " + currency + "\n"
                + "IBAN: " + consumerAccount + "\n");
            //TODO: Add payment details onto the smart contract!
        }
        res.status(200);
        res.end();
    });

    // TESTING METHODS

    app.post('/test/:amount', (req, res) => {
        const amount = req.params.amount;

        contract.methods.setNumber(amount)
            .send({ from: web3.eth.defaultAccount }).then(() => {
                console.log('Setting number to ' + amount);
                res.send('Setting number to ' + amount);
            }).catch((err) => {
                console.log('Failed to set number');
                res.send('Failed to retrieve number');
            });
    });

    app.get('/test', (req, res) => {
        contract.methods.getNumber().call().then((number) => {
            console.log('Number = ' + number);
            res.send(number);
        }).catch((err) => {
            console.log('Failed to retrieve number');
            res.send('Failed to retrieve number');
        });
    });

    // Donation contract calls

    app.post('/addDonation/:name/:sender/:timestamp/:amount', (req, res) => {
        const { name, sender, timestamp, amount } = req.params

        contract.methods.addDonation(name, sender, timestamp, amount)
            .send({ from: web3.eth.defaultAccount }).then(() => {
                console.log('Succeeded making a donation ' + amount);
                res.send('Setting number to ' + amount);
            });
    });

    app.post('/makePayment/:receiver/:timestamp/:amount', (req, res) => {
        const { receiver, timestamp, amount } = req.params

        contract.methods.makePayment(receiver, timestamp, amount)
            .send({ from: web3.eth.defaultAccount }).then(() => {
                console.log('Succeeded making a donation ' + amount);
                res.send('Setting number to ' + amount);
            });
    });

    app.get('/getDonationsSum', (req, res) => {
        contract.methods.calculateTotalDonationAmount().call().then((number) => {
            console.log('Number list = ' + number);
            res.send(number);
        }).catch((err) => {
            console.log('Failed to retrieve donation list');
            res.send('Failed to retrieve donation list');
        });
    });

    app.get('/calculateTotalDonationAmount', (req, res) => {
        contract.methods.calculateTotalDonationAmount().call().then((number) => {
            console.log('Number = ' + number);
            res.send(number);
        }).catch((err) => {
            console.log('Failed to retrieve donation Sum');
            res.send('Failed to retrieve donation Sum');
        });
    });

    app.get('/calculateTotalPaymentAmount', (req, res) => {
        contract.methods.calculateTotalPaymentAmount().call().then((number) => {
            console.log('Number = ' + number);
            res.send(number);
        }).catch((err) => {
            console.log('Failed to retrieve payment Sum');
            res.send('Failed to retrieve payment Sum');
        });
    });
}
