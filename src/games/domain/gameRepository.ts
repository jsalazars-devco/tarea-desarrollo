import { Game } from './gameModel';
import { GameRequest } from './gameRequestModel';

export interface GameRepository {
    findAll(): Promise<Game[] | null>;
    findById(gameId: number): Promise<Game | null>;
    create(game: GameRequest): Promise<Game | null>;
    updateById(gameId: number, game: GameRequest): Promise<Game | null>;
    createWithId(gameId: number, game: GameRequest): Promise<Game | null>;
    deleteById(gameId: number): Promise<null>;
}