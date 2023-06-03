import express from "express";
import { gameController } from "../../dependencies";

const gameRouter = express.Router();

gameRouter.route("/")
    .get(
        gameController.findGames.bind(gameController)
    )
    .post(
        gameController.createGame.bind(gameController)
    );

gameRouter.route('/:id')
    .get(
        gameController.findGameById.bind(gameController)
    )
    .put(
        gameController.updateGameById.bind(gameController)
    );

export { gameRouter };