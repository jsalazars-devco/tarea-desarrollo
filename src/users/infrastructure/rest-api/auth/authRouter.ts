import express from "express";
import { authController } from "../../../dependencies";
import { corsWithOptions } from "../../../../shared/infrastructure/cors";

const authRouter = express.Router();

authRouter.route("/login")
    .post(
        corsWithOptions,
        authController.login.bind(authController)
    );

authRouter.route('/logout')
    .get(
        corsWithOptions,
        authController.logout.bind(authController)
    );

export { authRouter };