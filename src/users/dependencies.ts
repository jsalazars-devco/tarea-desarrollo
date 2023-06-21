import { UserController } from './infrastructure/rest-api/userController';
import { UserManager } from './application/userManager';
import { MysqlUserRepository } from './infrastructure/mysqlRepository/mysqlUserRepository';
import MysqlDatabaseConnection from '../shared/infrastructure/mysqlConnection';

const mysqlDatabaseConnection = MysqlDatabaseConnection.getInstance();

const userRepository = new MysqlUserRepository(mysqlDatabaseConnection);
const userManager = new UserManager(userRepository);

export const userController = new UserController(userManager);