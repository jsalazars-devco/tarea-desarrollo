import { OrderController } from "./infrastructure/rest-api/orderController";
import { OrderManager } from "./application/orderManager";
import { MysqlOrderRepository } from "./infrastructure/mysqlRepository/mysqlOrderRepository";
import MysqlDatabaseConnection from "../shared/infrastructure/mysqlConnection";
import { MysqlGameRepository } from "../games/infrastructure/mysqlRepository/mysqlGameRepository";

const mysqlDatabaseConnection = MysqlDatabaseConnection.getInstance();
const orderRepository = new MysqlOrderRepository(mysqlDatabaseConnection);
const gameRepository = new MysqlGameRepository(mysqlDatabaseConnection);
const orderManager = new OrderManager(orderRepository, gameRepository);

export const orderController = new OrderController(orderManager);