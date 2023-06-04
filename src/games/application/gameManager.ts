import { Game } from "../domain/gameModel";
import { GameRepository } from "../domain/gameRepository";
import { GameRequest } from "../domain/gameRequestModel";

export class GameManager {
    constructor(
        private readonly gameRepository: GameRepository,
    ) { }

    async findGames(): Promise<Game[] | null> {
        const games = await this.gameRepository.findAll();
        return games;
    }

    async createGame(game: GameRequest): Promise<Game | null> {
        const newGame = await this.gameRepository.create(game);
        return newGame;
    }

    async findGameById(gameId: number): Promise<Game | null> {
        const game = await this.gameRepository.findById(gameId);
        return game;
    }

    async updateGameById(gameId: number, game: GameRequest): Promise<Game | null> {
        const updatedGame = await this.gameRepository.updateById(gameId, game);
        return updatedGame;
    }

    async createGameWithId(gameId: number, game: GameRequest): Promise<Game | null> {
        const updatedGame = await this.gameRepository.createWithId(gameId, game);
        return updatedGame;
    }
}