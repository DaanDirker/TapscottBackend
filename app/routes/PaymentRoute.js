const axios = require('axios');
require('dotenv').config();

const WEBHOOK_URL = process.env.TUNNEL_HOST + "/transaction/save";

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
}
