import { Game } from "./gameModel";
import { GameRequest } from "./gameRequestModel";

export interface GameRepository {
    findAll(): Promise<Game[] | null>;
    findById(gameId: number): Promise<Game | null>;
    create(game: GameRequest): Promise<Game | null>;
    updateById(gameId: number, game: GameRequest): Promise<[Game, number] | null>;
}