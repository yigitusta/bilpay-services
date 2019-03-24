import { JsonController, Body, Post, BadRequestError, InternalServerError, BodyParam } from "routing-controllers";
import * as auth from "../services/Auth";
import { ResponseType, BlockchainError, LoginError, RegistrationError, BilchainError } from "../types";

@JsonController()
export default class AuthController {

  @Post("/login")
  async login(
    @BodyParam("email", { required: true }) email: string,
    @BodyParam("password", { required: true }) password: string
  ): Promise<ResponseType> {
    try {
      const token = await auth.login(email, password);
      return { success: true, message: "Login Success", payload: { token } };
    } catch (e) {
      if (e instanceof LoginError) {
        throw new BadRequestError(e.message);
      }
      throw new InternalServerError("Unsuccessful login attempt.");
    }
  }

  @Post("/register")
  async register(
    @BodyParam("email", { required: true }) email: string,
    @BodyParam("password", { required: true }) password: string
  ): Promise<ResponseType> {
    try {
      const user = await auth.register(email, password);
      return { success: true, message: "Registration is successful.", payload: { email: user.email } };
    } catch (e) {
      if (e instanceof RegistrationError) {
        throw new BadRequestError(e.message);
      }
      if (e instanceof BlockchainError || e instanceof BilchainError) {
       throw new InternalServerError(e.message);
      }
      throw new InternalServerError("Registration is unsuccessful.");
    }
  }
}