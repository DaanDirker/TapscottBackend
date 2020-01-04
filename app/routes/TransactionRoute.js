const maxTransactions = 20;

module.exports = (app, web3, contract, mollieClient) => {

    const IBAN1_TRANSPORT = "24876886716447363185588813355746526635635194205268490312410266622053044284305";
    const IBAN2_LABOR = "21101672275253988548001904242265822070105250070583967579935560498662065541434";
    const IBAN3_FISHING_NETS = "108225485566937822872576597874002787108276722130336665161358893314090900759191";
    const IBAN4_BOAT_RENTAL = "50384645994308965417808879872058743009792248571523618537638218895414707210992";
    const IBAN5_BANK = "23307515537208797899233296081011547068218340857635826214184846275146571848076";

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
    app.post('/transaction/save', async (req, res) => {
        const paymentId = req.body.id;
        const payment = await mollieClient.payments.get(paymentId);

        if (payment.isPaid()) {
            const { paidAt, metadata } = payment;
            const { value, currency } = payment.amount;
            const { consumerAccount } = payment.details;

            const contractAmountFormat = Math.round((value * 100));
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

    // Donation contract calls

    app.post('/transaction/donation/:name/:amount', (req, res) => {
        const { name, amount } = req.params
        const contractAmountFormat = Math.round((amount * 100));
        const timestamp = new Date();

        contract.methods.addDonation(name, timestamp, contractAmountFormat)
            .send({ from: web3.eth.defaultAccount }).then(() => {
                console.log('Succeeded making a donation of' + contractAmountFormat);
                res.send('Succeeded making a donation of ' + contractAmountFormat);
            }).catch((err) => {
                console.log(err.toString());
                res.send(err.toString());
            });
    });

    app.post('/transaction/payment/:receiver/:amount', (req, res) => {
        const { receiver, amount } = req.params;
        const contractAmountFormat = Math.round((amount * 100));
        const timestamp = new Date();

        contract.methods.makePayment(receiver, timestamp, contractAmountFormat)
            .send({ from: web3.eth.defaultAccount }).then(() => {
                console.log('Succeeded making a payment of' + contractAmountFormat);
                res.send('Succeeded making a donation of ' + contractAmountFormat);
            }).catch((err) => {
                console.log(err.toString());
                res.send(err.toString());
            });
    });

    app.get('/sum/donation', (req, res) => {
        contract.methods.calculateTotalDonationAmount().call().then((sum) => {
            const decimalReturn = (sum / 100).toFixed(2);
            console.log('Decimal number = ' + decimalReturn);
            res.send(decimalReturn);
        }).catch((err) => {
            console.log(err.toString());
            res.send(err.toString());
        });
    });

    app.get('/sum/payment', (req, res) => {
        contract.methods.calculateTotalPaymentAmount().call().then((sum) => {
            const decimalReturn = (sum / 100).toFixed(2);
            console.log('Decimal number = ' + decimalReturn);
            res.send(decimalReturn);
        }).catch((err) => {
            console.log(err.toString());
            res.send(err.toString());
        });
    });

    var newDonations = [];

    app.get('/transaction/donations', (req, res) => {
        contract.methods.getStructDonations().call().then((donations) => {
            //convert donations to list with double amount values
            var convertedList = [];
            for (let index = 0; index < donations.length; index++) {
                convertedList.push({
                    name: donations[index].name,
                    sender: donations[index].sender,
                    timestamp: donations[index].timestamp,
                    amount: (donations[index].amount / 100).toFixed(2)
                });
            }

            res.send(convertedList);
        }).catch((err) => {
            console.log(err.toString());
            res.send(err.toString());
        });
    });

    app.get('/transaction/donations/latest', (req, res) => {
        contract.methods.getlatestDonations().call().then((donations) => {
            let endDonations = [];
            donations.forEach(donation => endDonations.push(formatDonation(donation)));
            res.send(endDonations);
        }).catch((err) => {
            console.log(err.toString());
            res.send(err.toString());
        });
    });

    app.get('/transaction/payments', (req, res) => {
        contract.methods.getStructPayments().call().then((paymentList) => {

            var paymentObject = { transport: 0, labor: 0, fishingNets: 0, boatRental: 0, bank: 0, total: 0 };

            for (let index = 0; index < paymentList.length; index++) {
                if (paymentList[index].receiver === IBAN1_TRANSPORT) {
                    console.log("Found Transport Payment: " + paymentList[index].amount);
                    paymentObject.transport += parseInt(paymentList[index].amount);
                } else if (paymentList[index].receiver === IBAN2_LABOR) {
                    console.log("Found Labor Payment: " + paymentList[index].amount);
                    paymentObject.labor += parseInt(paymentList[index].amount);
                } else if (paymentList[index].receiver === IBAN3_FISHING_NETS) {
                    console.log("Found Fishing Nets Payment: " + paymentList[index].amount);
                    paymentObject.fishingNets += parseInt(paymentList[index].amount);
                } else if (paymentList[index].receiver === IBAN4_BOAT_RENTAL) {
                    console.log("Found Boat rental Payment: " + paymentList[index].amount);
                    paymentObject.boatRental += parseInt(paymentList[index].amount);
                } else if (paymentList[index].receiver === IBAN5_BANK) {
                    console.log("Found Bank Payment: " + paymentList[index].amount);
                    paymentObject.bank += parseInt(paymentList[index].amount);
                }
                paymentObject.total += parseInt(paymentList[index].amount);
            }
            //Convert values to string with 2 decimals
            paymentObject.transport = (paymentObject.transport / 100).toFixed(2);
            paymentObject.labor = (paymentObject.labor / 100).toFixed(2);
            paymentObject.fishingNets = (paymentObject.fishingNets / 100).toFixed(2);
            paymentObject.boatRental = (paymentObject.boatRental / 100).toFixed(2);
            paymentObject.bank = (paymentObject.bank / 100).toFixed(2);
            paymentObject.total = (paymentObject.total / 100).toFixed(2);

            str = JSON.stringify(paymentObject);
            console.log('Payment object = ' + str);
            res.send(paymentObject);
        }).catch((err) => {
            console.log(err.toString());
            res.send(err.toString());
        });
    });

    app.get('/transaction/payments/latest', (req, res) => {
        contract.methods.getlastestPayments().call().then((payments) => {
            //convert payments to list with double amount values
            var convertedList = [];
            for (let index = 0; index < payments.length; index++) {
                convertedList.push({
                    receiver: payments[index].receiver,
                    timestamp: payments[index].timestamp,
                    amount: (payments[index].amount / 100).toFixed(2)
                });
            }
            str = JSON.stringify(convertedList);
            console.log('Latest Payment list = ' + str);
            res.send(convertedList);
        }).catch((err) => {
            console.log(err.toString());
            res.send(err.toString());
        });
    });

    app.get('/transaction/donations/user/:requestedUser', (req, res) => {
        const requestedUser = req.params.requestedUser;

        contract.methods.getUserDonations(requestedUser).call().then((donations) => {
            console.log('Donations of requested user = ' + donations);
            res.send(donations);
        }).catch((err) => {
            console.log(err.toString());
            res.send(err.toString());
        });
    });

    let decimals = 2;
    let divider = 100;

    formatAmount = (value) => (value/divider).toFixed(decimals).toString();

    formatDonation = (donation) => {
        return {
            name: donation[0],
            sender: donation[1],
            timestamp: donation[2],
            amount: formatAmount(donation[3])
        }
    }
}
