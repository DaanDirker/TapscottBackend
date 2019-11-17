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
            .send({from: web3.eth.defaultAccount}).then(() => {
                console.log('Setting number to ' + amount);
                res.send('Setting number to ' + amount);
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
}
