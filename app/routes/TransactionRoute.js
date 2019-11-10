const maxTransactions = 20;

module.exports = (app, config, web3, contract) => {

    //Retrieving newest transactions
    app.get('/transactions/new/:amount', (req, res) => {
        const amount = req.params.amount;

        if (amount > maxTransactions) amount = maxTransactions;
        res.send(amount);
    });

    //Retrieving highest amount donated transactions
    app.get('/transactions/highest/:amount', (req, res) => {
        const amount = req.params.amount;

        if (amount > maxTransactions) amount = maxTransactions;
        res.send(amount);
    });

    //Retrieve transactions of given Public/Private key combination
    app.get('/transactions/my', (req, res) => {
        res.send('Your Transactions!');
    });

    app.post('/transaction', (req, res) => {
        // Calling a method in the Smart Contract
        // res.send(contract.getNumber());
    });

    app.post('/test/:number', (req, res) => {
        contract.methods.setNumber(20).call().then(() => {
            console.log('Setting number to 20');
            res.send('Setting number to 20');
        }).catch((err) => {
            console.log('Failed to set number');
            res.send('Failed to set number');
        });
    })

    app.get('/test', (req, res) => {
        contract.methods.getNumber().call().then((number) => {
            console.log('Number = ' + number);
            res.send(number);
        }).catch((err) => {
            console.log('Failed to retrieve number');
            res.send('Failed to retrieve number');
        });
    });
};
