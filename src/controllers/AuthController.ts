import { JsonController, Body, Post } from "routing-controllers";
import { getRepository } from "typeorm";
import { getManager } from "typeorm";
import bcrypt from "bcryptjs";
import { ResponseModel } from "../types";
import { User } from "../entity/User";
import { createWallet } from "../services/Blockchain";

@JsonController()
export default class AuthController {

  @Post("/login")
  async login(@Body() body: any): Promise<ResponseModel> {
    const { email, password } = body;
    const authFail: ResponseModel = { success: false, message: "Email or password is wrong." };

    if (!email || !password) {
      return authFail;
    }

    const user = await getRepository(User).findOne({ where: [{ email }] });
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        const token = "asdfgh" + Math.floor(Math.random() * 1000000);
        await getRepository(User).update({ email }, { token });
        return { success: true, message: "Login Success", payload: { token } };
      } else {
        return authFail;
      }
    } else {
      return authFail;
    }
  }

  @Post("/register")
  async register(@Body() body: any): Promise<ResponseModel> {
    const { email, password } = body;
    if (!(email && password)) {
      return { success: false, message: "Email or password is missing" };
    }
    else {
      const user = new User();
      user.email = email;
      user.merchant = false;
      user.password = bcrypt.hashSync(password, 8);
      await getManager().save(user);
      const wallet = await createWallet("sandbox");
      wallet.user = user;
      await getManager().save(wallet);
      return { success: true, message: "User created.", payload: { email: user.email } };
    }
  }
}