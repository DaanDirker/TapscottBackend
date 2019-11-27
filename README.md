# TapscottBackend

A basic NodeJS Express backend for communicating with our smart contract on the Ethereum network.

## Requirements
* Node, working on v12.11.0 
* Ngrok or Localtunnel
* Genache-cli or Genache client

## Installation
Install all required npm packages:
```bash
npm i
```

## Running the backend

### Tunnel
Due to our application using Mollie as a third party for making transactions, we need to handle their webhooks with a tunnel while running on localhost. This can be achieved by either running the tool *ngrok* or *localtunnel*. With *ngrok* it should be:
```bash
ngrok http [PORT_NUMBER]
```

And for *localtunnel* the npm script "*npm run tunnel*" has been defined. Keep in mind that only one machine can use this subdomain.
Or starting a tunnel via your cmd
```bash
lt --port [PORT_NUMBER] --subdomain [TAPSCOTT_DOMAIN] 
```

### Ganache
To use ganache the *ENVIRONMENT* value within the .env file needs to be set to "ganache". Make sure the .env file ganache host value and port match with the ganache-cli or ganache client settings. Make sure either one of them is running.

Now the contract need to be deployed onto ganache. This can be done using the command:
```bash
truffle migrate
```

This command returns a contract address which needs to be copied into the *CONTRACT_ADDRESS* value within the *.env* file. After that ganache has been set up.

### Server

Now that ganache or another environment has been set up, the server can be started:
```bash
npm run server
```

## Configuration
All configuration within this project is held in the *.env* file.
