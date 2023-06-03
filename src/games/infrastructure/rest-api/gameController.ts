import { Request, Response } from "express";
import { GameManager } from "../../application/gameManager";
import ErrorWithStatus from "../../../shared/domain/errorWithStatus";

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

    async findGameById(req: Request, res: Response) {
        try {
            const game = await this.gameManager.findGameById(Number(req.params.id));
            res.status(200);
            res.send(game);
        } catch (error: any) {
            res.status(error.status);
            res.send(error.message);
        }
    }

    async updateGameById(req: Request, res: Response) {
        try {
            const values = await this.gameManager.updateGameById(Number(req.params.id), req.body);
            if (values !== null) {
                const [game, status] = values;
                res.status(status);
                res.send(game);
            }
            else {
                const error = new ErrorWithStatus('Error in database');
                error.status = 500;
                throw error;
            }
        } catch (error: any) {
            res.status(error.status);
            res.send(error.message);
        }
    }

}