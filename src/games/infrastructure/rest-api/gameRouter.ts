import express from "express";
import { gameController } from "../../dependencies";
import { cors, corsWithOptions } from "../../../shared/infrastructure/cors";

const gameRouter = express.Router();

gameRouter.route("/")
    .get(
        cors,
        gameController.findGames.bind(gameController)
    )
    .post(
        corsWithOptions,
        gameController.createGame.bind(gameController)
    );

gameRouter.route('/:id')
    .get(
        cors,
        gameController.findGameById.bind(gameController)
    )
    .put(
        corsWithOptions,
        gameController.updateOrCreateGameById.bind(gameController)
    )
    .delete(
        corsWithOptions,
        gameController.deleteGameById.bind(gameController)
    );

export { gameRouter };