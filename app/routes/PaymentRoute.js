const axios = require('axios');
const { decimalFormat, nonDecimalFormat } = require('../../utils/Constants');

require('dotenv').config();

const WEBHOOK_URL = process.env.TUNNEL_HOST + "/donation/save";

module.exports = (app, web3, contract, mollieClient) => {

    const IBAN1_TRANSPORT = "71483434822557954811414208117486581150426872837138488758230305104170717921995";
    const IBAN2_LABOR = "24876886716447363185588813355746526635635194205268490312410266622053044284305";
    const IBAN3_FISHING_NETS = "21101672275253988548001904242265822070105250070583967579935560498662065541434";
    const IBAN4_BOAT_RENTAL = "108225485566937822872576597874002787108276722130336665161358893314090900759191";
    const IBAN5_BANK = "50384645994308965417808879872058743009792248571523618537638218895414707210992";

    // Create a payment
    app.post('/payment/mollie/:price/:name', (req, res) => {
        const price = req.params.price;
        const name = req.params.name;

        mollieClient.payments.create({
            amount: {
                value: price,
                currency: 'EUR'
            },
            description: 'Save the ocean with',
            redirectUrl: 'https://www.google.com',
            webhookUrl: WEBHOOK_URL,
            metadata: name
        }).then(payment => {
            let response = {
                'id': payment.id,
                'checkoutUrl': payment.getCheckoutUrl(),
                'user': payment.metadata,
            }
            res.status(200);
            res.json(response);
        }).catch(error => {
            console.log(error);
            res.send(error);
        });
    });

    app.post('/payment/:receiver/:amount', (req, res) => {
        const { receiver, amount } = req.params;
        const contractAmountFormat = nonDecimalFormat(amount);
        const timestamp = new Date();

        contract.methods.makePayment(receiver, timestamp.toString(), contractAmountFormat)
            .send({ from: web3.eth.defaultAccount }).then(() => {
                console.log('Succeeded making a payment of ' + contractAmountFormat);
                res.send('Succeeded making a donation of ' + contractAmountFormat);
            }).catch((err) => {
                console.log(err.toString());
                res.send(err.toString());
            });
    });

    // TODO: Inefficient way of calculation
    //Returns object with all transaction types and total values
    app.get('/payment/collection', (req, res) => {
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
            paymentObject.transport = decimalFormat(paymentObject.transport);
            paymentObject.labor = decimalFormat(paymentObject.labor);
            paymentObject.fishingNets = decimalFormat(paymentObject.fishingNets);
            paymentObject.boatRental = decimalFormat(paymentObject.boatRental);
            paymentObject.bank = decimalFormat(paymentObject.bank);
            paymentObject.total = decimalFormat(paymentObject.total);

            str = JSON.stringify(paymentObject);
            console.log('Payment object = ' + str);
            res.send(paymentObject);
        }).catch((err) => {
            console.log(err.toString());
            res.send(err.toString());
        });
    });

    app.get('/payment/object', (req, res) => {
        contract.methods.getPaymentObject().call().then((paymentObject) => {
            console.log(paymentObject);
            let paymentCollection = formatPaymentObject(paymentObject);
            str = JSON.stringify(paymentCollection);
            console.log('Payment object = ' + str);
            res.send(paymentObject);
        }).catch((err) => {
            console.log(err.toString());
            res.send(err.toString());
        });
    });

    app.get('/payment/latest', (req, res) => {
        contract.methods.getlatestPayments().call().then((payments) => {
            let endPayments = [];
            payments.forEach(payment => endPayments.push(formatPayment(payment)));
            res.send(endPayments);
        }).catch((err) => {
            console.log(err.toString());
            res.send(err.toString());
        });
    });

    app.get('/payment/sum', (req, res) => {
        contract.methods.calculateTotalPaymentAmount().call().then((sum) => {
            const decimalReturn = decimalFormat(sum);
            console.log('Decimal number = ' + decimalReturn);
            res.send(decimalReturn);
        }).catch((err) => {
            console.log(err.toString());
            res.send(err.toString());
        });
    });

    formatPayment = (payment) => {
        return {
            sender: payment[0],
            timestamp: payment[1],
            amount: decimalFormat(payment[2])
        }
    }

    formatPaymentObject = (paymentObject) => {
        return {
            transport: paymentObject[0],
            labor: paymentObject[1],
            fishingNets: paymentObject[2],
            BoatRental: paymentObject[3],
            Bank: paymentObject[4],
            Total: paymentObject[5]
        }
    }
}
