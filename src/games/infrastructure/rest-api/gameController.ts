import { Request, Response } from "express";
import { GameManager } from "../../application/gameManager";

export class GameController {

    constructor(
        private readonly gameManager: GameManager
    ) { }

    async findGames(_req: Request, res: Response) {
        try {
            const games = await this.gameManager.findGames();
            res.status(200);
            res.send(games);
        } catch (error: any) {
            res.status(error.status);
            res.send(error.message);
        }
    }

    async findGameById(req: Request, res: Response) {
        try {
            const game = await this.gameManager.findGameById(req.params.id);
            res.status(200);
            res.send(game);
        } catch (error: any) {
            res.status(error.status);
            res.send(error.message);
        }
    }

    async createGame(req: Request, res: Response) {
        try {
            const game = await this.gameManager.createGame(req.body);
            res.status(201);
            res.send(game);
        } catch (error: any) {
            res.status(error.status);
            res.send(error.message);
        }
    }

}