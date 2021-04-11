const Wallet = require("ethereumjs-wallet");

var EthWallet = Wallet["default"].generate();
console.log("address: " + EthWallet.getAddressString());
console.log("privateKey: " + EthWallet.getPrivateKeyString());
