import express from "express";
import { gameController } from "../../dependencies";

const gameRouter = express.Router();

gameRouter.get(
    "/",
    gameController.findGames.bind(gameController)
);

gameRouter.post(
    "/",
    gameController.createGame.bind(gameController)
);

gameRouter.get(
    "/:id",
    gameController.findGameById.bind(gameController)
);

export { gameRouter };