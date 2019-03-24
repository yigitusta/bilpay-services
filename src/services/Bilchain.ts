import Stellar, { Asset, Operation, TransactionBuilder, Account } from "stellar-sdk";
import { getLogger } from "log4js";
import axios from "axios";
import { Wallet } from "../entity/Wallet";
import { BilchainError } from "../types";

const logger = getLogger("bilchain");

const url = "https://bilchain.herokuapp.com";

export async function createWallet(): Promise<Wallet> {
  const wallet = new Wallet();
  const keyPair = Stellar.Keypair.random();

  wallet.public = keyPair.publicKey();
  wallet.secret = keyPair.secret();
  wallet.sandbox = false;
  wallet.api_url = url;

  try {
    const response = await axios.post(`${url}/balance`, {
      key: wallet.public,
      amount: 100
    });
    if (!response.data.Key) {
      throw new BilchainError("Error creating wallet in Bilchain.");
    }
  } catch (e) {
    logger.error(e);
    throw new BilchainError("Error creating wallet in Bilchain.");
  }

  return wallet;
}

export async function retrieveBalance(wallet: Wallet): Promise<number> {
  try {
    const response = await axios.get(`${url}/balance/${wallet.public}`);
    return Number(response.data.Amount);
  } catch (e) {
    logger.error(e);
    throw new BilchainError("Error obtaining balance from Bilchain.");
  }
}

export async function sendBilcoin(sender: Wallet, receiver: Wallet, amount: number): Promise<number> {
  try {
    const senderAmount = await retrieveBalance(sender);

    if (senderAmount < amount) {
      throw new BilchainError("Insufficient funds.");
    }

    const res = await axios.post("https://bilchain.herokuapp.com/transaction", {
      sender: sender.public,
      receiver: receiver.public,
      amount: amount
    });

    const sentAmount = res.data.amount;

    return sentAmount;
  } catch (e) {
    logger.error(e);
    if (e instanceof BilchainError) {
      throw e;
    }
    throw new BilchainError("Error fulfilling Bilchain transaction request.");
  }
}