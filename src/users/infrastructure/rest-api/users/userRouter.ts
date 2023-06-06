import express from "express";
import { userController } from "../../../dependencies";
import { corsWithOptions } from "../../../../shared/infrastructure/cors";

const userRouter = express.Router();

userRouter.route("/")
    .get(
        corsWithOptions,
        userController.findUsers.bind(userController)
    )
    .post(
        corsWithOptions,
        userController.createUser.bind(userController)
    );

userRouter.route('/:id')
    .get(
        corsWithOptions,
        userController.findUserById.bind(userController)
    )
    .put(
        corsWithOptions,
        userController.updateOrCreateUserById.bind(userController)
    )
    .delete(
        corsWithOptions,
        userController.deleteUserById.bind(userController)
    );

export { userRouter };