import { GameController } from "./infrastructure/rest-api/gameController";
import { GameManager } from "./application/gameManager";
import { MysqlGameRepository } from "./infrastructure/mysqlRepository/mysqlGameRepository";
import MysqlDatabaseConnection from "../shared/infrastructure/mysqlConnection";

const mysqlDatabaseConnection = MysqlDatabaseConnection.getInstance();
const gameRepository = new MysqlGameRepository(mysqlDatabaseConnection);
const gamesManager = new GameManager(gameRepository);

export const gameController = new GameController(gamesManager);