import { Action } from "routing-controllers";
import { User } from "../entity/User";
import { getRepository } from "typeorm";

export default async (action: Action) => {
    const bearer = action.request.headers["authorization"];
    try {
        const token = bearer.split(" ")[1];
        return await getRepository(User).
            findOne({ where: [{ token: token }], relations: ["wallets"] });
    } catch (e) {
        console.log(e);
    }
};