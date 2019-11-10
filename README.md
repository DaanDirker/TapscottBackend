# TapscottBackend

A basic NodeJS Express backend for communicating with our smart contract on the Ethereum network.

## Requirements
* Node, working on v12.11.0 
* Ngrok or Localtunnel

## Installation
Install all required npm packages:
```bash
npm i
```

## Running the backend
Due to our application using Mollie as a third party for making transactions, we need to handle their webhooks with a tunnel while running on localhost. This can be achieved by either running the tool *ngrok* or *localtunnel*. With *ngrok* it should be:
```bash
ngrok http [PORT_NUMBER]
```

And for *localtunnel* the npm script "*npm run tunnel*" has been defined. Keep in mind that only one machine can use this subdomain.

After that the server can be started:
```bash
npm run server
```

## Configuration
All configuration within this project is held in the *app/config/config.json*.
