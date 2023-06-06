import MysqlDatabaseConnection from '../../../shared/infrastructure/mysqlConnection';
import { User } from '../../domain/users/userModel';
import { UserRequest } from '../../domain/users/userRequestModel';
import { UserResponse } from '../../domain/users/userResponseModel';
import { UserRepository } from '../../domain/users/userRepository';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { UserDbRequest } from '../../domain/users/userDbRequestModel';
import { CREATE, CREATE_WITH_ID, DELETE_BY_ID, FIND_ALL, FIND_BY_ID, FIND_BY_USERNAME, UPDATE_BY_ID } from './querys';
import ErrorWithStatus from '../../../shared/domain/errorWithStatus';

export class MysqlUserRepository implements UserRepository {

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

    async findAll(): Promise<UserResponse[] | null> {

        await this.connectToMysql();
        const connection = this.getMysqlConnection();

        try {
            const [data,] = await connection.execute<RowDataPacket[]>(FIND_ALL);

            const users = data.map((user: RowDataPacket) => new UserResponse(
                user.id,
                user.username,
                Boolean(user.admin),
            ));

            return users;

        } catch (error) {
            console.error('Error executing query:', error);
            const err = new ErrorWithStatus('Error in database');
            err.status = 500;
            throw err;
        } finally {
            await this.closeConnectionToMysql();
        }
    }

    async create(user: UserRequest): Promise<UserResponse | null> {

        await this.connectToMysql();
        const connection = this.getMysqlConnection();

        try {

            const userToCreate: UserDbRequest = await new UserRequest(
                user.username,
                user.password,
                user.admin,
            ).returnUserDbRequest();

            const [data,] = await connection.execute<RowDataPacket[]>(FIND_BY_USERNAME, [userToCreate.username]);

            if (data.length > 0) {
                if (
                    data[0].username !== userToCreate.username
                    || !(await User.verifyPassword(user.password, data[0].password, data[0].salt))
                    || Boolean(data[0].admin) !== userToCreate.admin
                ) {
                    const error = new ErrorWithStatus('To modify the user, try the PUT /users/{userId} endpoint');
                    error.status = 403;
                    throw error;
                }
                const userAlreadyOnDb = new UserResponse(
                    data[0].id,
                    data[0].username,
                    Boolean(data[0].admin),
                );

                return userAlreadyOnDb;
            }

            const values = Object.values(userToCreate).filter(value => value !== undefined);
            const [result,] = await connection.execute<ResultSetHeader>(CREATE, values);
            const [userRow,] = await connection.execute<RowDataPacket[]>(FIND_BY_ID, [result.insertId]);

            const newUser = new UserResponse(
                userRow[0].id,
                userRow[0].username,
                Boolean(userRow[0].admin),
            );

            return newUser;

        } catch (error: any) {
            throw error;
        } finally {
            await this.closeConnectionToMysql();
        }
    }

    async findById(userId: number): Promise<UserResponse | null> {

        await this.connectToMysql();
        const connection = this.getMysqlConnection();

        try {
            const [data,] = await connection.execute<RowDataPacket[]>(FIND_BY_ID, [userId]);

            if (data.length > 0) {
                const user = new UserResponse(
                    data[0].id,
                    data[0].username,
                    Boolean(data[0].admin),
                );

                return user;
            }

            const error = new ErrorWithStatus('Invalid ID');
            error.status = 403;
            throw error;

        } catch (error: any) {
            if (error.status === 403) {
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

    async updateById(userId: number, user: UserRequest): Promise<UserResponse | null> {
        await this.connectToMysql();
        const connection = this.getMysqlConnection();

        try {
            const [data,] = await connection.execute<RowDataPacket[]>(FIND_BY_ID, [userId]);

            if (data.length > 0) {
                const values = Object.values(await new UserRequest(
                    user.username,
                    user.password,
                    user.admin,
                ).returnUserDbRequest());

                values.push(userId);

                await connection.execute<ResultSetHeader>(UPDATE_BY_ID, values);
                const [data,] = await connection.execute<RowDataPacket[]>(FIND_BY_ID, [userId]);

                const updatedUser = new UserResponse(
                    data[0].id,
                    data[0].username,
                    Boolean(data[0].admin),
                );

                return updatedUser;
            }

            return null;

        } catch (error: any) {
            if (error.status === 403) {
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

    async createWithId(userId: number, user: UserRequest): Promise<UserResponse | null> {
        await this.connectToMysql();
        const connection = this.getMysqlConnection();

        try {

            const newData: UserDbRequest = await new UserRequest(
                user.username,
                user.password,
                user.admin,
            ).returnUserDbRequest();

            const values = Object.values(newData);
            values.unshift(userId);

            await connection.execute<ResultSetHeader>(CREATE_WITH_ID, values);
            const [data,] = await connection.execute<RowDataPacket[]>(FIND_BY_ID, [userId]);

            const createdUser = new UserResponse(
                data[0].id,
                data[0].username,
                Boolean(data[0].admin),
            );

            return createdUser;

        } catch (error: any) {
            if (error.status === 403) {
                const err = error;
                throw err;
            }
            if ('code' in error && error.code === 'ER_DUP_ENTRY') {
                console.error('Error:', error);
                const err = new ErrorWithStatus('User name already on the database');
                err.status = 403;
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

    async deleteById(userId: number): Promise<null> {
        await this.connectToMysql();
        const connection = this.getMysqlConnection();

        try {
            const [data,] = await connection.execute<RowDataPacket[]>(FIND_BY_ID, [userId]);
            if (data.length > 0) {
                await connection.execute<ResultSetHeader>(DELETE_BY_ID, [userId]);
                return null;
            }
            const error = new ErrorWithStatus('Invalid ID');
            error.status = 403;
            throw error;
        } catch (error: any) {
            if (error.status === 403) {
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