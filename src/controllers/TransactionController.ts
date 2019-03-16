import { JsonController, Body, CurrentUser, Post } from "routing-controllers";
import { getRepository } from "typeorm";
import { ResponseModel } from "../types";
import { User } from "../entity/User";
import { sendBilcoin } from "../services/Blockchain";

@JsonController("/transaction")
export default class TransactionController {

    @Post("/create") // amount ve karsinin emaili ve varsa sandbox
    async create(@CurrentUser({ required: true }) user: User, @Body() body: { amount: number, email: string, sandbox?: boolean }): Promise<ResponseModel> {
        const { amount, email, sandbox } = body;
        const sendingWallet = user.wallets.find(w => w.sandbox === Boolean(sandbox));
        const receivingUser = await getRepository(User).findOne({ where: [{ email }], relations: ["wallets"] }); // handle invalid user
        const receivingWallet = receivingUser.wallets.find(w => w.sandbox === Boolean(sandbox));
        const result = await sendBilcoin(sendingWallet, receivingWallet, amount);
        return { success: true, message: "success", payload: result };
    }

    // todo : get amount controller
}