import { GameController } from "./infrastructure/rest-api/gameController";
import { GamesGetter } from "./application/gamesGetter";
// import { InMemoryGameRepository } from "./infrastructure/inMemoryGameRepository/inMemoryGameRepository";
import { MysqlGameRepository } from "./infrastructure/mysqlRepository/mysqlGameRepository";

// const gameRepository = new InMemoryGameRepository();
const gameRepository = new MysqlGameRepository();
const gamesGetter = new GamesGetter(
  gameRepository,
);

export const gameController = new GameController(gamesGetter);