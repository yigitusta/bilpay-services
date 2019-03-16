import Stellar from "stellar-sdk";
import axios from "axios";

(async function() {
  const keypair = Stellar.Keypair.random();

  const address = `https://friendbot.stellar.org/?addr=${keypair.publicKey()}`;

  const server = new Stellar.Server("https://horizon-testnet.stellar.org");

  Stellar.Network.useTestNetwork();

  try {
    const response = await axios.get(address);
    const account = await server.loadAccount(keypair.publicKey());
    console.log(account.balances[0].balance);
  } catch (e) {
    console.log(e);
  }
}());