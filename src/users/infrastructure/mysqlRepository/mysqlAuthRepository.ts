import { RowDataPacket } from 'mysql2/promise';
import MysqlDatabaseConnection from '../../../shared/infrastructure/mysqlConnection';
import { AuthRepository } from '../../domain/auth/authRepository';
import { LoginRequest } from '../../domain/auth/loginRequestModel';
import { LoginResponse } from '../../domain/auth/loginResponseModel';
import { FIND_BY_ID, FIND_BY_USERNAME } from './querys';
import ErrorWithStatus from '../../../shared/domain/errorWithStatus';
import { User } from '../../domain/users/userModel';
import { TokenRequest } from '../../domain/auth/tokenRequestModel';
import { UserResponse } from '../../domain/users/userResponseModel';

export class MysqlAuthRepository implements AuthRepository {

    private connectToMysql: MysqlDatabaseConnection['connect'];
    private closeConnectionToMysql: MysqlDatabaseConnection['close'];
    private getMysqlConnection: MysqlDatabaseConnection['getConnection'];

    constructor(
        private readonly mysqlDatabaseConnection: MysqlDatabaseConnection
    ) {
        this.connectToMysql = this.mysqlDatabaseConnection.connect.bind(this.mysqlDatabaseConnection);
        this.closeConnectionToMysql = this.mysqlDatabaseConnection.close.bind(this.mysqlDatabaseConnection);
        this.getMysqlConnection = this.mysqlDatabaseConnection.getConnection.bind(this.mysqlDatabaseConnection);
    }

    async loginUser(login: LoginRequest): Promise<LoginResponse | null> {

        await this.connectToMysql();
        const connection = this.getMysqlConnection();

        try {
            const [data,] = await connection.execute<RowDataPacket[]>(FIND_BY_USERNAME, [login.username]);

            if (data.length === 0) {
                const error = new ErrorWithStatus('Invalid username or password');
                error.status = 401;
                throw error;
            }

            if (
                !(await User.verifyPassword(login.password, data[0].password, data[0].salt))
            ) {
                const error = new ErrorWithStatus('Invalid username or password');
                error.status = 401;
                throw error;
            }

            const user = new LoginResponse(
                data[0].id,
                data[0].username,
                Boolean(data[0].admin),
            );

            return user;

        } catch (error: any) {
            if (error.status < 500) {
                const err = error;
                throw err;
            }
            console.error('Error executing query:', error);
            const err = new ErrorWithStatus('Error in database');
            err.status = 500;
            throw err;
        } finally {
            await this.closeConnectionToMysql();
        }
    }

    async verifyUser(token: string): Promise<UserResponse | null> {

        await this.connectToMysql();
        const connection = this.getMysqlConnection();

        try {
            const tokenUserInfo = new TokenRequest(token).getTokenInfo();

            const [data,] = await connection.execute<RowDataPacket[]>(FIND_BY_ID, [tokenUserInfo.id]);

            if (data.length === 0) {
                const error = new ErrorWithStatus('Error in database');
                error.status = 500;
                throw error;
            }

            const user = new UserResponse(
                data[0].id,
                data[0].username,
                Boolean(data[0].admin),
            );

            return user;

        } catch (error: any) {
            if (error.status < 500) {
                const err = error;
                throw err;
            }
            console.error('Error executing query:', error);
            const err = new ErrorWithStatus('Error in database');
            err.status = 500;
            throw err;
        } finally {
            await this.closeConnectionToMysql();
        }
    }


}