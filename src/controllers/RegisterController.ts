import { Request, Response } from "express";
import { User } from "../entity/User";
import { getManager } from "typeorm";
import bcrypt from "bcryptjs";

const httpMessages = {
    onValidationError: {
      success: false,
      message: "Please enter email and password."
    },
    onUserSaveError: {
      success: false,
      message: "That email address already exists."
    },
    onUserSaveSuccess: {
      success: true,
      message: "Successfully created new user."
    }
};

class RegisterController {
    static register = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        if (!(email && password)) {
          res.json(httpMessages.onValidationError);
        }
        else {
          const newUser = new User();
          newUser.email = email;
          newUser.password = bcrypt.hashSync(password, 8);
          getManager().save(newUser);
          const payload = {
            email: newUser.email
          };
          res.json(Object.assign({ payload }, httpMessages.onUserSaveSuccess));
        }
    }
}

export default RegisterController;