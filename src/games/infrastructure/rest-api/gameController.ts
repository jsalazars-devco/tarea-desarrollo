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

    async updateOrCreateGameById(req: Request, res: Response) {
        try {
            const updatedValues = await this.gameManager.updateGameById(Number(req.params.id), req.body);
            if (updatedValues !== null) {
                const game = updatedValues;
                res.status(200);
                res.send(game);
            }
            else {
                const createdValues = await this.gameManager.createGameWithId(Number(req.params.id), req.body);
                if (createdValues !== null) {
                    const game = createdValues;
                    res.status(201);
                    res.send(game);
                }
            }
        } catch (error: any) {
            res.status(error.status);
            res.send(error.message);
        }
    }

    async deleteGameById(req: Request, res: Response) {
        try {
            await this.gameManager.deleteGameById(Number(req.params.id));
            res.status(200);
            res.send(`Game with ID: "${req.params.id}" deleted`);
        } catch (error: any) {
            res.status(error.status);
            res.send(error.message);
        }
    }

}