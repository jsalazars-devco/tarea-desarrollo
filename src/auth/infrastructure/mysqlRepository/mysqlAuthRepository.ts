import { RowDataPacket } from 'mysql2/promise';
import MysqlDatabaseConnection from '../../../shared/infrastructure/mysqlConnection';
import { AuthRepository } from '../../domain/authRepository';
import { LoginRequest } from '../../domain/loginRequestModel';
import { FIND_BY_ID, FIND_BY_USERNAME } from './querys';
import ErrorWithStatus from '../../../shared/domain/errorWithStatus';
import { User } from '../../../users/domain/userModel';
import { UserResponse } from '../../../users/domain/userResponseModel';

export class MysqlAuthRepository implements AuthRepository {

    private executeMysqlQuery: MysqlDatabaseConnection['execute'];

    constructor(
        readonly mysqlDatabaseConnection: MysqlDatabaseConnection
    ) {
        this.executeMysqlQuery = mysqlDatabaseConnection.execute.bind(mysqlDatabaseConnection);
    }

    async loginUser(login: LoginRequest): Promise<User | null> {
        const data = await this.executeMysqlQuery(FIND_BY_USERNAME, [login.username]) as RowDataPacket[];
        try {
            return new User(
                data[0].id,
                data[0].username,
                data[0].password,
                Boolean(data[0].admin),
            );
        } catch (error) {
            const err = new ErrorWithStatus('Invalid username or password');
            err.status = 401;
            throw err;
        }
    }

    async verifyUser(id: number): Promise<UserResponse | null> {

        const data = await this.executeMysqlQuery(FIND_BY_ID, [id]) as RowDataPacket[];

        try {
            return new UserResponse(
                data[0].id,
                data[0].username,
                Boolean(data[0].admin),
            );
        } catch (error: any) {
            throw error;
        }
    }
}