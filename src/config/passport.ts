import passport from "passport";
import { Strategy } from "passport-http-bearer";
import { User } from "../entity/User";
import { getRepository } from "typeorm";

const BearerStrategy = Strategy;

export const initBearerStrategy = () => {
  passport.use(new BearerStrategy(async (token, done) => {
    const user = await getRepository(User).findOne({ where: [{ token: token }] });
    if (!user) return done(null, false);
    return done(null, user);
  }));
};