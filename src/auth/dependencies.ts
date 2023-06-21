import { AuthController } from '../auth/infrastructure/rest-api/authController';
import { AuthManager } from '../auth/application/authManager';
import { MysqlAuthRepository } from '../auth/infrastructure/mysqlRepository/mysqlAuthRepository';
import MysqlDatabaseConnection from '../shared/infrastructure/mysqlConnection';

const mysqlDatabaseConnection = MysqlDatabaseConnection.getInstance();

const authRepository = new MysqlAuthRepository(mysqlDatabaseConnection);
const authManager = new AuthManager(authRepository);

export const authController = new AuthController(authManager);
