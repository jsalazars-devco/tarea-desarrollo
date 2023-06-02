import { Game } from "../../domain/gameModel";
import { GameRepository } from "../../domain/gameRepository";
import { GAMES } from "./games";

export class InMemoryGameRepository implements GameRepository {
    async find(): Promise<Game[] | null> {
        const games = GAMES;

        if (!games) {
            return null;
        }

        const gamesInRepository = games.map(game => new Game(
            game.id,
            game.name,
            game.stock,
            game.price,
            game.consolesIds,
            game.categoriesIds,
            game.imageUrl));

        return gamesInRepository;
    }
}