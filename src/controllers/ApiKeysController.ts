import { Request, Response } from "express";

const httpMessages = {
    onAuthorizationFail: {
      success: false,
      message: "Authorization fail"
    }
};

class ApiKeysController {
    static getKeys = async (req: Request, res: Response) => {
      res.json({ user: req.user.email });
    }
}

export default ApiKeysController;