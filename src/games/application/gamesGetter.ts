import { Game } from "../domain/gameModel";
import { GameRepository } from "../domain/gameRepository";

export class GamesGetter {
  constructor(
    private readonly gameRepository: GameRepository,
  ) {}

  async getGames(): Promise<Game[] | null> {

    const games = await this.gameRepository.get();

    if (!games) {
      const error = new Error(`There are no games to be shown`);
      throw error;
    }

    return games;

  }
}