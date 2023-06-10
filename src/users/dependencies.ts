import { UserController } from './infrastructure/rest-api/userController';
import { AuthController } from '../auth/infrastructure/rest-api/authController';
import { UserManager } from './application/userManager';
import { AuthManager } from '../auth/application/authManager';
import { MysqlUserRepository } from './infrastructure/mysqlRepository/mysqlUserRepository';
import { MysqlAuthRepository } from '../auth/infrastructure/mysqlRepository/mysqlAuthRepository';
import MysqlDatabaseConnection from '../shared/infrastructure/mysqlConnection';

const mysqlDatabaseConnection = MysqlDatabaseConnection.getInstance();

const userRepository = new MysqlUserRepository(mysqlDatabaseConnection);
const userManager = new UserManager(userRepository);

const authRepository = new MysqlAuthRepository(mysqlDatabaseConnection);
const authManager = new AuthManager(authRepository);

export const userController = new UserController(userManager);

export const authController = new AuthController(authManager);
