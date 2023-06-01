import { Request, Response } from "express";
import { GamesGetter } from "../../application/gamesGetter";

export class GameController {

  constructor(
    private readonly gamesGetter: GamesGetter
  ){}

  async sendGames(_req: Request, res: Response) {
    const games = await this.gamesGetter.getGames();
    res.status(200);
    res.send(games);
  }

}