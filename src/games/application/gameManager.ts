import { Game } from "../domain/gameModel";
import { GameRepository } from "../domain/gameRepository";

export class GameManager {
    constructor(
        private readonly gameRepository: GameRepository,
    ) { }

    async findGames(): Promise<Game[] | null> {

        const games = await this.gameRepository.find();

        if (!games) {
            const error = new Error(`There are no games to be shown`);
            throw error;
        }

        return games;

    }

    async findGameById(gameId: string): Promise<Game | null> {

        const game = await this.gameRepository.findById(gameId);

        if (!game) {
            const error = new Error(`There are no games to be shown`);
            throw error;
        }

        return game;

    }
}