import { Router } from "express";
import auth from "./auth";
import apiKeys from "../routes/apiKeys";
import passport from "passport";

const routes = Router();

routes.use("/auth", auth);
routes.use("/apiKeys", apiKeys);

export default routes;