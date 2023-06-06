import { UserController } from './infrastructure/rest-api/users/userController';
import { AuthController } from './infrastructure/rest-api/auth/authController';
import { UserManager } from './application/userManager';
import { AuthManager } from './application/authManager';
import { MysqlUserRepository } from './infrastructure/mysqlRepository/mysqlUserRepository';
import { MysqlAuthRepository } from './infrastructure/mysqlRepository/mysqlAuthRepository';
import MysqlDatabaseConnection from '../shared/infrastructure/mysqlConnection';

const mysqlDatabaseConnection = MysqlDatabaseConnection.getInstance();

const userRepository = new MysqlUserRepository(mysqlDatabaseConnection);
const userManager = new UserManager(userRepository);

const authRepository = new MysqlAuthRepository(mysqlDatabaseConnection);
const authManager = new AuthManager(authRepository);

export const userController = new UserController(userManager);

export const authController = new AuthController(authManager);
