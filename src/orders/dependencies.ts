import { OrderController } from "./infrastructure/rest-api/orderController";
import { OrderManager } from "./application/orderManager";
import { MysqlOrderRepository } from "./infrastructure/mysqlRepository/mysqlOrderRepository";
import MysqlDatabaseConnection from "../shared/infrastructure/mysqlConnection";

const mysqlDatabaseConnection = MysqlDatabaseConnection.getInstance();
const orderRepository = new MysqlOrderRepository(mysqlDatabaseConnection);
const orderManager = new OrderManager(orderRepository);

export const orderController = new OrderController(orderManager);