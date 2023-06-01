import express from "express";
import { gameController } from "../../dependencies";

const gameRouter = express.Router();

gameRouter.get(
    "/",
    gameController.sendGames.bind(gameController)
);

export { gameRouter }