import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import bcrypt from "bcryptjs";

const httpMessages = {
    onAuthenticationFail: {
      success: false,
      message: "User or password is wrong."
    },
    onLoginSuccess: {
      success: true,
      message: "Login Success"
    }
};

class LoginController {
    static login = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        if (!email || !password) {
          res.json(httpMessages.onAuthenticationFail);
          return;
        }
        const user = await getRepository(User).findOne({ where: [{ email }] });
        if (user) {
          if (bcrypt.compareSync(password, user.password)) {
            const token = "asdfgh" + Math.floor(Math.random() * 1000000);
            await getRepository(User).update({ email }, { token });
            res.json(Object.assign({ payload: { token } }, httpMessages.onLoginSuccess));
          } else {
            res.json(httpMessages.onAuthenticationFail);
          }
        } else {
          res.json(httpMessages.onAuthenticationFail);
        }
    }
}

export default LoginController;