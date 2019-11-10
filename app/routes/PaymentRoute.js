const axios = require('axios');

module.exports = (app, config) => {

    // Adding a payment
    app.post('/payment/:price', (req, res) => {
        console.log(config.mollie.baseEndpoint + " " + config.mollie.testToken);
        
        //Create payment with Mollie
        axios.post(config.mollie.baseEndpoint + '/payment', {
            amount: {
                currency: "EUR",
                value: req.params.price
            },
            description: "Donate",
            redirectUrl: "https://www.google.com",
            method: "ideal"
        },
        {
            headers: {'Authorization': "bearer " + config.mollie.testToken}
        }).then((resp) => {
            console.log(resp);
            res.send(resp)
        }).catch((err) => {
            console.log(err)
        });
        //Create a Mollie Order
        //Listen for completion of order and/or wait for webhook result
        
        //How will the order be linked to an address? Given by Webhook? Metadata?
        //If order completion has address, send request with WEB3 to write
    });

}
