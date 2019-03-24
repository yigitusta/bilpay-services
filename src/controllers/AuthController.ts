import { JsonController, Body, Post } from "routing-controllers";
import * as auth from "../services/Auth";
import { ResponseType, BlockchainError, LoginError, RegistrationError } from "../types";

@JsonController()
export default class AuthController {

  @Post("/login")
  async login(@Body() body: { email: string, password: string }): Promise<ResponseType> {
    const { email, password } = body;

    if (!(email && password)) {
      return { success: false, message: "Email or password is missing." };
    }

    try {
      const token = await auth.login(email, password);
      return { success: true, message: "Login Success", payload: { token } };
    } catch (e) {
      if (e instanceof LoginError) {
        throw { success: false, message: e.message };
      }
      return { success: false, message: "Login is unsuccessful." };
    }
  }

  @Post("/register")
  async register(@Body() body: { email: string, password: string }): Promise<ResponseType> {
    const { email, password } = body;
    if (!(email && password)) {
      return { success: false, message: "Email or password is missing" };
    }
    try {
      const user = await auth.register(email, password);
      return { success: true, message: "Registration is successful.", payload: { email: user.email } };
    } catch (e) {
      if (e instanceof BlockchainError || e instanceof RegistrationError) {
        return { success: false, message: e.message };
      }
      return { success: false, message: "Registration is unsuccessful." };
    }
  }
}