const axios = require('axios');
require('dotenv').config();

const WEBHOOK_URL = "https://tapscott.localtunnel.me/transaction/save";

module.exports = (app, mollieClient) => {

    // Create a payment
    app.post('/payment/:price/:name', (req, res) => {
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
            console.log(payment.getCheckoutUrl());
            res.status(200);
            res.send(payment.getCheckoutUrl());
        }).catch(error => {
            console.log(error);
            res.send(error);
        });
    });
}
