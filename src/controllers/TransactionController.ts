import { JsonController, Body, Get, CurrentUser } from "routing-controllers";
import { ResponseModel } from "../types";
import { User } from "../entity/User";

@JsonController("/transaction")
export default class TransactionController {

    @Get("/create")
    async create(@CurrentUser({ required: true }) user: User): Promise<ResponseModel> {
        return { success: true, message: "success", payload: user };
    }
}