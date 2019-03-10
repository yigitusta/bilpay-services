import { Router } from "express";
import LoginController from "../controllers/LoginController";
import RegisterController from "../controllers/RegisterController";

const router = Router();

router.post("/login", LoginController.login);

router.post("/register", RegisterController.register);

export default router;
