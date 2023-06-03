import ErrorWithStatus from "../../shared/domain/errorWithStatus";
import { Game } from "../domain/gameModel";
import { GameRepository } from "../domain/gameRepository";

export class GameManager {
    constructor(
        private readonly gameRepository: GameRepository,
    ) { }

    async findGames(): Promise<Game[] | null> {
        const games = await this.gameRepository.find();
        if (!games) {
            const error = new ErrorWithStatus('There are no games to be shown');
            error.status = 405;
            throw error;
        }
        return games;
    }

    async findGameById(gameId: string): Promise<Game | null> {
        const game = await this.gameRepository.findById(gameId);
        return game;
    }

    async createGame(game: Game): Promise<Game | null> {
        const newGame = await this.gameRepository.create(game);
        if (!newGame) {
            const error = new ErrorWithStatus('There are no games to be shown');
            error.status = 405;
            throw error;
        }
        return newGame;
    }
}