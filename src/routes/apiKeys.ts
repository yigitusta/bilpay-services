import passport from "passport";
import { Router } from "express";
import ApiKeysController from "../controllers/ApiKeysController";
const router = Router();

router.get("/", passport.authenticate("bearer", {session: false}), ApiKeysController.getKeys);

export default router;
