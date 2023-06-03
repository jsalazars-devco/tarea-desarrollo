import { Game } from "./gameModel";

export interface GameRepository {
    find(): Promise<Game[] | null>;
    findById(gameId: string): Promise<Game | null>;
    create(game: Game): Promise<Game | null>;
}