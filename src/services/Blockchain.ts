import Stellar, { Asset, Operation, TransactionBuilder, Account } from "stellar-sdk";
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

export async function sendBilcoin(sender: Wallet, receiver: Wallet, amount: number) {

    Stellar.Network.useTestNetwork();

    // todo : compare sender net and reciver net
    const server = new Stellar.Server(sender.api_url);
    const account = await server.loadAccount(sender.public);

    const transaction = new Stellar.TransactionBuilder(account, { fee: 100 })
    // Add a payment operation to the transaction
        .addOperation(Stellar.Operation.payment({
            destination: receiver.public,
            // The term native asset refers to lumens
            asset: Stellar.Asset.native(),
            // Specify 350.1234567 lumens. Lumens are divisible to seven digits past
            // the decimal. They are represented in JS Stellar SDK in string format
            // to avoid errors from the use of the JavaScript Number data structure.
            amount: String(amount),
        }))
        // Make this transaction valid for the next 30 seconds only
        .setTimeout(30)
        // Uncomment to add a memo (https://www.stellar.org/developers/learn/concepts/transactions.html)
        // .addMemo(StellarSdk.Memo.text('Hello world!'))
        .build();

    transaction.sign(Stellar.Keypair.fromSecret(sender.secret));

    try {
        const transactionResult = await server.submitTransaction(transaction);
        console.log(JSON.stringify(transactionResult, null, 2));
        return transactionResult;
    } catch (e) {
        console.log("An error has occured:");
        console.log(e);
    }
}