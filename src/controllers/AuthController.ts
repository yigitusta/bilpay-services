import { JsonController, Param, Body, Get, Post, Put, Delete } from "routing-controllers";
import { getRepository } from "typeorm";
import { getManager } from "typeorm";
import bcrypt from "bcryptjs";
import { ResponseModel } from "../types/index";
import { User } from "../entity/User";

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
      const newUser = new User();
      newUser.email = email;
      newUser.password = bcrypt.hashSync(password, 8);
      await getManager().save(newUser);
      const payload = {
        email: newUser.email
      };
      return { success: true, message: "User created." };
    }
  }
}