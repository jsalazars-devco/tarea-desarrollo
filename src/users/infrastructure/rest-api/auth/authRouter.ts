import express from 'express';
import { authController } from '../../../dependencies';
import { corsWithOptions } from '../../../../shared/infrastructure/cors';
import { AuthController } from './authController';

const authRouter = express.Router();

authRouter.route('/login')
    .post(
        corsWithOptions,
        authController.login.bind(authController)
    );

authRouter.route('/logout')
    .get(
        corsWithOptions,
        AuthController.verifyUser,
        authController.logout.bind(authController)
    );

authRouter.route('/me')
    .get(
        corsWithOptions,
        AuthController.verifyUser,
        authController.me.bind(authController)
    );

export { authRouter };