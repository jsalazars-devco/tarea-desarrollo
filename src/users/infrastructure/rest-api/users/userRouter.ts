import express from 'express';
import { userController } from '../../../dependencies';
import { corsWithOptions } from '../../../../shared/infrastructure/cors';
import { AuthController } from '../auth/authController';

const userRouter = express.Router();

userRouter.route('/')
    .get(
        corsWithOptions,
        AuthController.verifyUser,
        AuthController.verifyAdmin,
        userController.findUsers.bind(userController)
    )
    .post(
        corsWithOptions,
        AuthController.verifyUser,
        AuthController.verifyAdmin,
        userController.createUser.bind(userController)
    );

userRouter.route('/:id')
    .get(
        corsWithOptions,
        AuthController.verifyUser,
        userController.findUserById.bind(userController)
    )
    .put(
        corsWithOptions,
        AuthController.verifyUser,
        AuthController.verifyAdmin,
        userController.updateOrCreateUserById.bind(userController)
    )
    .delete(
        corsWithOptions,
        AuthController.verifyUser,
        AuthController.verifyAdmin,
        userController.deleteUserById.bind(userController)
    );

export { userRouter };