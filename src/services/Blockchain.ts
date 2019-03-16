import Stellar from "stellar-sdk";
import axios from "axios";
import { Wallet } from "../entity/Wallet";
import "../entity/Wallet";

export async function createWallet(type: "sandbox" | "live"): Promise<Wallet> {
  const wallet = new Wallet();
  const keyPair = Stellar.Keypair.random();

  wallet.public = keyPair.publicKey();
  wallet.secret = keyPair.secret();
  wallet.sandbox = true;
  wallet.api_url = "https://horizon-testnet.stellar.org";

  await axios.get(`https://friendbot.stellar.org/?addr=${keyPair.publicKey()}`);

  return wallet;
}

export async function sendBilcoin(receiver: string) {

}