import { Request, Response } from "express";
import { GameManager } from "../../application/gameManager";

export class GameController {

    constructor(
        private readonly gameManager: GameManager
    ) { }

    async findGames(_req: Request, res: Response) {
        const games = await this.gameManager.findGames();
        res.status(200);
        res.send(games);
    }

    async findGameById(req: Request, res: Response) {
        const game = await this.gameManager.findGameById(req.params.id);
        res.status(200);
        res.send(game);
    }

}