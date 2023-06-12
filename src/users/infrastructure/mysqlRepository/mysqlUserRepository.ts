import MysqlDatabaseConnection from '../../../shared/infrastructure/mysqlConnection';
import { User } from '../../domain/userModel';
import { UserRequest } from '../../domain/userRequestModel';
import { UserRequestWithId } from '../../domain/userRequestWithIdModel';
import { UserResponse } from '../../domain/userResponseModel';
import { UserRepository } from '../../domain/userRepository';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { UserDbRequest } from '../../domain/userDbRequestModel';
import { CREATE, CREATE_WITH_ID, DELETE_BY_ID, FIND_ALL, FIND_BY_ID, FIND_BY_USERNAME, UPDATE_BY_ID } from './querys';
import ErrorWithStatus from '../../../shared/domain/errorWithStatus';

export class MysqlUserRepository implements UserRepository {

    private executeMysqlQuery: MysqlDatabaseConnection['execute'];

    constructor(
        readonly mysqlDatabaseConnection: MysqlDatabaseConnection
    ) {

        this.executeMysqlQuery = mysqlDatabaseConnection.execute.bind(mysqlDatabaseConnection);

    }

    async findAll(): Promise<UserResponse[] | null> {

        const data = await this.executeMysqlQuery(FIND_ALL, []) as RowDataPacket[];

        const users = data.map((user: RowDataPacket) => new UserResponse(
            user.id,
            user.username,
            Boolean(user.admin),
        ));

        return users;
    }

    async create(user: UserDbRequest): Promise<UserResponse | null> {

        const data = await this.executeMysqlQuery(FIND_BY_USERNAME, [user.username]) as RowDataPacket[];

        if (data.length > 0) {
            if (
                data[0].username !== user.username
                || !(await User.verifyPassword(user.password, data[0].password, data[0].salt))
                || Boolean(data[0].admin) !== user.admin
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

        const values = Object.values(user);
        const result = await this.executeMysqlQuery(CREATE, values) as ResultSetHeader;
        const userRow = await this.executeMysqlQuery(FIND_BY_ID, [result.insertId]) as RowDataPacket[];

        const newUser = new UserResponse(
            userRow[0].id,
            userRow[0].username,
            Boolean(userRow[0].admin),
        );

        return newUser;
    }

    async findById(userId: number): Promise<UserResponse | null> {

        const data = await this.executeMysqlQuery(FIND_BY_ID, [userId]) as RowDataPacket[];

        if (data.length === 0) {
            const error = new ErrorWithStatus('User not found');
            error.status = 404;
            throw error;
        }

        const user = new UserResponse(
            data[0].id,
            data[0].username,
            Boolean(data[0].admin),
        );

        return user;

    }

    async updateById(userId: number, user: UserDbRequest): Promise<UserResponse | null> {

        const userOnDb = await this.executeMysqlQuery(FIND_BY_ID, [userId]) as RowDataPacket[];

        if (userOnDb.length === 0) {
            return null;
        }

        const values = Object.values(user);

        values.push(userId);

        await this.executeMysqlQuery(UPDATE_BY_ID, values);
        const data = await this.executeMysqlQuery(FIND_BY_ID, [userId]) as RowDataPacket[];

        const updatedUser = new UserResponse(
            data[0].id,
            data[0].username,
            Boolean(data[0].admin),
        );

        return updatedUser;
    }

    async createWithId(userId: number, user: UserRequest): Promise<UserResponse | null> {

        const values = Object.values(await new UserRequestWithId(
            userId,
            user.username,
            user.password,
            user.admin,
        ).returnUserDbRequest());

        values.unshift(userId);

        await this.executeMysqlQuery(CREATE_WITH_ID, values);
        const data = await this.executeMysqlQuery(FIND_BY_ID, [userId]) as RowDataPacket[];

        const createdUser = new UserResponse(
            data[0].id,
            data[0].username,
            Boolean(data[0].admin),
        );

        return createdUser;

    }

    async deleteById(userId: number): Promise<null> {

        const data = await this.executeMysqlQuery(FIND_BY_ID, [userId]) as RowDataPacket[];

        if (data.length === 0) {
            const error = new ErrorWithStatus('User not found');
            error.status = 404;
            throw error;
        }

        await this.executeMysqlQuery(DELETE_BY_ID, [userId]);
        return null;
    }
}