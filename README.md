# Decentralized Vaccination Certification System

Developer: Jacob Suchorabski

```
This is a work in progress and will be updated once the project is finished
```

This is a proof-of-concept applying the verifiable credential [data model defined by the W3C](https://www.w3.org/TR/vc-data-model/) in a real world scenario. This repository covers a basic demo system with three applications each representing an issuer (= Vaccination center distributing certificates), holder (= Patient receiving the vaccine and a certificate) and a verifier (could be airport security for example verifying the validity of a proof).

## Starting the applications

The issuer, holder and verifier applications are based on React and you can install each projects dependencies by either using npm or yarn in each project folder.

For npm use:
```bash
npm install
```

For yarn use:
```bash
yarn install
```

Before starting each application the issuer, holder and verifier each need to be configured using their config file located under ```src/config/settings.json``` in each project. If the file does not exist please create it. The file should have the following structure:

```json
{
    "HTTP_PROVDER": "<YOUR_INFURA_HTTP_PROVIDER_URL>",
    "WALLET_ADDRESS": "<YOUR_WALLET_ADDRESS>",
    "WALLET_PRIVATE_KEY": "<YOUR_WALLET_KEY>"
}
```

You will have to replace each value with your data. To create an HTTP provider please use your own Ethereum node or use a free node from [infura](https://infura.io/). 

You can generate an Ethereum wallet with the provided utility program located under ```utils/```. Simply run the installation command in the folder mentioned above and then run: 

```bash
node identity-generator.js
```

The application will output a wallet address and private key which can be placed inside the config file. Please create two wallet addresses for the holder and issuer.

Finally, you can start  each the holder, issuer and verifier application by running either:

```bash
npm start
```
or
```bash
yarn start
```