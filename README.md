# TapscottBackend

This is a basic NodeJS Express backend for communicating with our smart contract on the Ethereum network.

## Requirements
* Node, working on v12.11.0 
* Ngrok or Localtunnel
* Genache-cli or Genache client(*)

(*) We focus on the following.

## Installation
We use NPM to install all of the modules and packages needed to run the project. Navigate to the back-end folder and install all required npm packages:
```bash
npm i
```

## Running the backend

### Tunnel
Due to our application using Mollie as a third party for making transactions, we need to handle their webhooks with a tunnel while running on localhost. This can be achieved by either running the tool *ngrok* or *localtunnel*. With *ngrok* it should be:
```bash
ngrok http [PORT_NUMBER]
```

And for *localtunnel* the command can be run from your command line. Keep in mind that only one machine can use this subdomain. That means if two students want to work with the backend they both need to specify a different subdomain like *TapScott1* and *Tapscott2*.
```bash
lt --port [PORT_NUMBER] --subdomain [TAPSCOTT_DOMAIN] 
```

Finally copy the setup subdomain given by either ngrok or localtunnel and navigate to *.env* file. Paste the input on the *TUNNEL_HOST* variable. This procedure is also required on the front-end. Visit the front-end Git readme for the location.

### Ganache
For the local *Ethereum* blockchain we use ganache. Install the application and creat a project.
To use ganache the *ENVIRONMENT* value within the .env file needs to be set to "ganache". Make sure the *.env* file ganache host value and port match with the ganache-cli or ganache client settings. Make sure either one of them is running.

For the first setup before deploying some build files need to be deleted. Navigate to *build/contracts* and delete the files inside. Now the contract needs to be deployed onto ganache. This can be done using the command:
```bash
truffle migrate --network development
```

This command returns a contract address which needs to be copied into the *CONTRACT_ADDRESS* value within the *.env* file. After that ganache has been set up. With network we specify development which has the gaslimit settings for the server.

### Mollie
For the mollie payments an account is required. After logging in on Mollie navigate to the settings dashboard. Here you can retrieve the Token needed for the payment interaction. Place this key inside the *.env* file.

### Server

When ganache is running, your localtunnel has been activated, the needed truffle migration and your the *CONTRACT_ADDRESS*, *TUNNEL_HOST* with the Mollie configuration have been updated in the *.env* file, the server can be started.
```bash
npm start
```
We are using Nodemon so each update will refreash the server. However If there are updates to a smart contract to add a new truffle migrate call has to be made before the new funcitonality can be used.
Another way
```bash
start server
```
## Configuration
All configuration within this project is held in the *.env* file.

## Contract calls

We're using a single contract named *Donation.sol* where we have all our calls. Right now the application doesn't use all of them so some are for future uses on expanding the application. With the running server you can use an application like *Postman* or *Insomnia* to execute calls without the front-end running. They're split into 2 categories: *Payments* and *Donations*. 
We used the port 3000 on localhost to which the following back-end calls can attach.

### Payment
POST */payment/:receiver/:amount* : Single payment with receiver and amount parameters

POST */payment/mollie/:price/:name* : Creates a Mollie payment with price and name

GET */payment/collection* : Returns a PaymentObject collection

GET */payment/object* : Returns a PaymentObject Collection (non-functional for now)

GET */payment/latest* : Returns 10 latest payments

GET */payment/sum* : Returns a total Sum of all payments

### Donation
POST */donation/save* : Saves a donation from the Mollie Webhook

POST */donation/:name/:sender/:amount* : Creates a donation with name and amount. *sender* contains the bank account.

GET */donation/all* : Returns all donations

GET */donation/latest* : Returns 10 latest donations

GET */donation/sum* : Returns a total Sum of all donations

GET */donation/user/:requestedUser* : Returns all donations from a certain user
