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

            //Inserting Payment details onto smart contract

            const contractAmountFormat = Math.round((value * 100));
            const currentDate = new Date();

            contract.methods.addDonation(metadata, consumerAccount, currentDate.toString(), contractAmountFormat)
                .send({ from: web3.eth.defaultAccount }).then(() => {
                    console.log('Succeeded making a donation ' + contractAmountFormat);
                    res.send('Setting number to ' + contractAmountFormat);
                }).catch((err) => {
                    console.log('Failed to set donation');
                    console.log(err.toString());
                });
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
                console.log(err.toString());
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


    app.post('/testNummer/:amount', (req, res) => {
        const amount = req.params.amount;

        contract.methods.setNummertje(amount)
            .send({ from: web3.eth.defaultAccount }).then(() => {
                console.log('Setting number to ' + amount);
                res.send('Setting number to ' + amount);
            }).catch((err) => {
                console.log('Failed to set number');
                console.log(err.toString());
            });
    });

    app.get('/testNummer', (req, res) => {
        contract.methods.getNummertje().call().then((number) => {
            console.log('Number = ' + number);
            res.send(number);
        }).catch((err) => {
            console.log('Failed to retrieve number');
            console.log(err.toString());
            res.send('Failed to retrieve number');
        });
    });

    // Donation contract calls

    app.post('/transaction/addDonation/:name/:sender/:timestamp/:amount', (req, res) => {
        const { name, sender, timestamp, amount } = req.params

        contract.methods.addDonation(name, sender, timestamp, amount)
            .send({ from: web3.eth.defaultAccount }).then(() => {
                console.log('Succeeded making a donation ' + amount);
                res.send('Setting number to ' + amount);
            }).catch((err) => {
                console.log('Failed to set donation');
                console.log(err.toString());
            });
    });

    app.post('/transaction/addPayment/:receiver/:timestamp/:amount', (req, res) => {
        const { receiver, timestamp, amount } = req.params

        contract.methods.makePayment(receiver, timestamp, amount)
            .send({ from: web3.eth.defaultAccount }).then(() => {
                console.log('Succeeded making a donation ' + amount);
                res.send('Setting number to ' + amount);
            }).catch((err) => {
                console.log('Failed to set payment');
                console.log(err.toString());
                res.send('Failed to set payment');
            });
    });

    app.get('/sum/donation', (req, res) => {
        contract.methods.calculateTotalDonationAmount().call().then((number) => {
            console.log('Number list = ' + number);
            res.send(number);
        }).catch((err) => {
            console.log('Failed to retrieve donation list');
            res.send('Failed to retrieve donation list');
        });
    });

    app.get('/sum/payment', (req, res) => {
        contract.methods.calculateTotalPaymentAmount().call().then((number) => {
            console.log('Number = ' + number);
            res.send(number);
        }).catch((err) => {
            console.log('Failed to retrieve payment Sum');
            res.send('Failed to retrieve payment Sum');
        });
    });

    app.get('/transaction/getDonations', (req, res) => {
        contract.methods.getStructDonations().call().then((number) => {
            console.log('Number list = ' + number);
            res.send(number);
        }).catch((err) => {
            console.log('Failed to retrieve donation list');
            res.send('Failed to retrieve donation list');
        });
    });

    app.get('/transaction/getpayments', (req, res) => {
        contract.methods.getStructPayments().call().then((number) => {
            console.log('Number list = ' + number);
            res.send(number);
        }).catch((err) => {
            console.log('Failed to retrieve payment list');
            res.send('Failed to retrieve payment list');
        });
    });

    app.get('/transaction/getUserDonations/:requestedUser', (req, res) => {
        const requestedUser = req.params.requestedUser;

        contract.methods.getUserDonations(requestedUser).call().then((donations) => {
            console.log('Donations of requested user = ' + donations);
            res.send(donations);
        }).catch((err) => {
            console.log('Failed to retrieve user specific donations');
            res.send('Failed to retrieve user specific donations');
        });
    });
}
