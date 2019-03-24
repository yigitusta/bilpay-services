import { JsonController, CurrentUser, Post, Get, QueryParam, BodyParam, BadRequestError, InternalServerError } from "routing-controllers";
import { getRepository } from "typeorm";
import { ResponseType, BilchainError } from "../types";
import { User } from "../entity/User";
import { sendBilcoin, retrieveBalance } from "../services/Bilchain";

@JsonController("/transaction")
export default class TransactionController {

    @Post("/create")
    async create(
        @CurrentUser({ required: true }) user: User,
        @BodyParam("email", { required: true }) email: string,
        @BodyParam("amount", { required: true }) amount: number,
        @BodyParam("sandbox", { required: true }) sandbox: boolean
    ): Promise<ResponseType> {
        const sendingWallet = user.wallets.find(w => w.sandbox === sandbox);
        const receivingUser = await getRepository(User).findOne({ where: [{ email }], relations: ["wallets"] }); // handle invalid user
        if (!receivingUser) {
            throw new BadRequestError("User with the provided e-mail address does not exist!");
        }
        const receivingWallet = receivingUser.wallets.find(w => w.sandbox === sandbox);
        const sentAmount = await sendBilcoin(sendingWallet, receivingWallet, amount);
        return { success: true, message: "Amount is sent to the receiving user.", payload: { receiver: email, amount: sentAmount } };
    }

    @Get("/balance")
    async getBalance(
        @CurrentUser({ required: true }) user: User,
        @QueryParam("sandbox", { required: true }) sandbox: boolean
    ): Promise<ResponseType> {
        try {
            const wallet = await user.wallets.find(w => w.sandbox === sandbox);
            const balance = await retrieveBalance(wallet);
            return { success: true, message: "Balance is retrieved.", payload: { balance } };
        } catch (e) {
            if (e instanceof BilchainError) {
                throw new InternalServerError(e.message);
            }
            throw new InternalServerError("Unable to retrieve balance.");
        }
    }
}