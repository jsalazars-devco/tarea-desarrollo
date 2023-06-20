import { Request, Response } from 'express';
import { GameManager } from '../../application/gameManager';

export class GameController {

    constructor(
        private readonly gameManager: GameManager
    ) { }

    findGames(_req: Request, res: Response) {
        this.gameManager.findGames().then(games => {
            res.status(200);
            res.send(games);
        }
        ).catch((error: any) => {
            res.status(error.status);
            res.send(error.message);
        });
    }

    createGame(req: Request, res: Response) {
        this.gameManager.createGame(req.body).then(game => {
            res.status(201);
            res.send(game);
        }).catch((error: any) => {
            res.status(error.status);
            res.send(error.message);
        });
    }

    findGameById(req: Request, res: Response) {
        this.gameManager.findGameById(Number(req.params.id)).then(game => {
            res.status(200);
            res.send(game);
        }).catch((error: any) => {
            res.status(error.status);
            res.send(error.message);
        });
    }

    updateOrCreateGameById(req: Request, res: Response) {

        this.gameManager.updateGameById(Number(req.params.id), req.body).then(async (updatedGame) => {
            if (updatedGame !== null) {
                res.status(200);
                res.send(updatedGame);
            }
            else {
                const createdGame = await this.gameManager.createGameWithId(Number(req.params.id), req.body);
                if (createdGame !== null) {
                    res.status(201);
                    res.send(createdGame);
                }
            }
        }).catch((error: any) => {
            res.status(error.status);
            res.send(error.message);
        });
    }

    deleteGameById(req: Request, res: Response) {
        this.gameManager.deleteGameById(Number(req.params.id)).then(() => {
            res.status(200);
            res.set('Content-Type', 'text/plain');
            res.send(`Game with ID: "${req.params.id}" deleted`);
        }).catch((error: any) => {
            res.status(error.status);
            res.send(error.message);
        });
    }

}