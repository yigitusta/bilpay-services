import { getManager, getRepository } from "typeorm";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User } from "../entity/User";
import { createWallet } from "./Bilchain";
import { RegistrationError, LoginError } from "../types";

export const complete = async () => {
  // TODO: maybe handle SMS verification?
};

export const register = async (email: string, password: string): Promise<User> => {
  const existingUser = await getRepository(User).findOne({ where: [{ email }] });
  if (existingUser) {
    throw new RegistrationError("User already exists.");
  }

  const user = new User();
  user.email = email;
  user.password = bcrypt.hashSync(password, 8);
  const wallet = await createWallet();
  await getManager().save(user);
  wallet.user = user;
  await getManager().save(wallet);
  return user;
};

export const login = async (email: string, password: string): Promise<string> => {
  const user = await getRepository(User).findOne({ where: [{ email }] });
  if (user) {
    if (bcrypt.compareSync(password, user.password)) {
      const hash = crypto.createHash("sha256");
      hash.update(crypto.randomBytes(2048));
      const token = hash.digest("hex");
      await getRepository(User).update({ email }, { token });
      return token;
    } else {
      throw new LoginError("Passwords do not match.");
    }
  } else {
    throw new LoginError("Wrong e-mail address.");
  }
};