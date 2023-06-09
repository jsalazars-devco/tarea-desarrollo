import express from 'express';
import { gameController } from '../../dependencies';
import { cors, corsWithOptions } from '../../../shared/infrastructure/cors';
import { AuthController } from '../../../users/infrastructure/rest-api/auth/authController';

const gameRouter = express.Router();

gameRouter.route('/')
    .get(
        cors,
        gameController.findGames.bind(gameController)
    )
    .post(
        corsWithOptions,
        AuthController.verifyUser,
        gameController.createGame.bind(gameController)
    );

gameRouter.route('/:id')
    .get(
        cors,
        gameController.findGameById.bind(gameController)
    )
    .put(
        corsWithOptions,
        AuthController.verifyUser,
        gameController.updateOrCreateGameById.bind(gameController)
    )
    .delete(
        corsWithOptions,
        AuthController.verifyUser,
        AuthController.verifyAdmin,
        gameController.deleteGameById.bind(gameController)
    );

export { gameRouter };