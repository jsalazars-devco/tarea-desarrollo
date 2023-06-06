import express from 'express';
import { authController } from '../../../dependencies';
import { corsWithOptions } from '../../../../shared/infrastructure/cors';

const authRouter = express.Router();

authRouter.route('/login')
    .post(
        corsWithOptions,
        authController.login.bind(authController)
    );

authRouter.route('/logout')
    .get(
        corsWithOptions,
        authController.logout.bind(authController)
    );

authRouter.route('/me')
    .get(
        corsWithOptions,
        authController.me.bind(authController)
    );

export { authRouter };