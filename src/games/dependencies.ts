import { GameController } from "./infrastructure/rest-api/gameController";
import { GamesGetter } from "./application/gamesGetter";
import { InMemoryGameRepository } from "./infrastructure/inMemomryGameRepository.ts/inMemoruGameRepository";

const gameRepository = new InMemoryGameRepository();
const gamesGetter = new GamesGetter(
  gameRepository,
);

export const gameController = new GameController(gamesGetter);