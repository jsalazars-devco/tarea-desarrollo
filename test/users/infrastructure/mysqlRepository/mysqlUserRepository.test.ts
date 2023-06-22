import MysqlDatabaseConnection from '../../../../src/shared/infrastructure/mysqlConnection';
import { UserDbRequest } from '../../../../src/users/domain/userDbRequestModel';
import { UserResponse } from '../../../../src/users/domain/userResponseModel';
import { User } from '../../../../src/users/domain/userModel';
import { MysqlUserRepository } from '../../../../src/users/infrastructure/mysqlRepository/mysqlUserRepository';
import * as QUERIES from '../../../../src/users/infrastructure/mysqlRepository/queries';
import { UserRequest } from '../../../../src/users/domain/userRequestModel';
import { UserRequestWithId } from '../../../../src/users/domain/userRequestWithIdModel';

jest.mock('../../../../src/users/domain/userRequestWithIdModel');

describe('MysqlUserRepository', () => {
    const mockUser = User;
    const spyUserVerifyPassword = jest.spyOn(mockUser, 'verifyPassword');
    spyUserVerifyPassword.mockImplementation((password, hashedPassword) => Promise.resolve(password === hashedPassword));

    const mockedReturnUserDbRequest = jest.fn().mockReturnValue({
        username: 'username',
        password: 'hashedPassword',
        admin: false
    });
    (UserRequestWithId as jest.Mock).mockImplementation(() => {
        return ({
            returnUserDbRequest: mockedReturnUserDbRequest,
        });
    });

    const mockMysqlConnection = MysqlDatabaseConnection.getInstance();
    const spyMysqlConnectionExecute = jest.spyOn(mockMysqlConnection, 'execute');

    spyMysqlConnectionExecute.mockImplementation((query, values): any => {
        if (query === QUERIES.FIND_ALL) {
            return [
                {
                    id: 1,
                    username: 'admin',
                    admin: 1,
                }
            ];
        }
        else if (query === QUERIES.FIND_BY_ID) {
            const id = values[0];
            if (id === 1) {
                return [{
                    id: id,
                    username: 'admin',
                    admin: 1,
                }];
            }
            else if (id === 2) {
                return [{
                    id: id,
                    username: 'username',
                    admin: 0,
                }];

            }
            return [];
        }
        else if (query === QUERIES.FIND_BY_USERNAME) {
            const username = values[0];
            if (username === 'admin') {
                return [{
                    id: 1,
                    username: 'admin',
                    password: 'hashedPassword',
                    admin: 1,
                }];
            }
            else {
                return [];
            }
        }
        else if (query === QUERIES.CREATE || query === QUERIES.CREATE_WITH_ID || query === QUERIES.UPDATE_BY_ID || query === QUERIES.DELETE_BY_ID) {
            return {
                insertId: 2,
            };
        }
    });

    let mysqlUserRepository: MysqlUserRepository;
    beforeEach(() => {
        mysqlUserRepository = new MysqlUserRepository(mockMysqlConnection);
    });

    describe('findAll', () => {
        test('should return an user array', async () => {
            const result = await mysqlUserRepository.findAll();
            expect(result).toBeInstanceOf(Array);
            expect(result?.every((user) => user instanceof UserResponse)).toBe(true);
        });
    });

    describe('create', () => {
        test('should return the new created user if the username is not on the database', async () => {
            const user = new UserDbRequest('username', 'hashedPassword', false);
            const result = await mysqlUserRepository.create(user);
            expect(result).toBeInstanceOf(UserResponse);
            expect(result?.id).toBe(2);
            expect(result?.username).toBe('username');
            expect(result?.admin).toBe(false);
        });

        test('should return the same user if the user is exactly the same in the database', async () => {
            const user = new UserDbRequest('admin', 'hashedPassword', true);
            const result = await mysqlUserRepository.create(user);
            expect(result).toBeInstanceOf(UserResponse);
            expect(result?.id).toBe(1);
            expect(result?.username).toBe('admin');
            expect(result?.admin).toBe(true);
        });

        test('should throw an exception if the user is already in the database but is not exactly the same', () => {
            const user = new UserDbRequest('admin', 'asdfg', true);
            expect(async () => await mysqlUserRepository.create(user)).rejects.toThrow();

            const user2 = new UserDbRequest('admin', 'hashedPassword', false);
            expect(async () => await mysqlUserRepository.create(user2)).rejects.toThrow();
        });
    });

    describe('findById', () => {
        test('should return the user if the ID is on the database', async () => {
            const existingUserId = 1;
            expect(await mysqlUserRepository.findById(existingUserId)).toBeInstanceOf(UserResponse);
        });

        test('should throw an exception if the ID is not on the database', async () => {
            const nonExistingUserId = 3;
            expect(async () => await mysqlUserRepository.findById(nonExistingUserId)).rejects.toThrow();
        });
    });

    describe('updateById', () => {
        test('should return the updated user if the ID is on the database', async () => {
            const existingUserId = 1;
            const values = new UserDbRequest('username', 'hashedPassword', false);
            expect(await mysqlUserRepository.updateById(existingUserId, values)).toBeInstanceOf(UserResponse);
        });

        test('should return null if the ID is not on the database', async () => {
            const nonExistingUserId = 3;
            const values = new UserDbRequest('username', 'hashedPassword', false);
            expect(await mysqlUserRepository.updateById(nonExistingUserId, values)).toBeNull();
        });
    });

    describe('createWithId', () => {
        test('should return the created user with the specified ID', async () => {
            const newUserId = 2;
            const values = new UserRequest('username', 'password', false);

            const result = await mysqlUserRepository.createWithId(newUserId, values);
            expect(result).toBeInstanceOf(UserResponse);
            expect(result?.id).toBe(newUserId);
            expect(result?.username).toBe('username');
            expect(result?.admin).toBe(false);
        });
    });

    describe('deleteById', () => {
        test('should return null if the ID is on the database', async () => {
            const existingUserId = 2;
            expect(await mysqlUserRepository.deleteById(existingUserId)).toBeNull();
        });

        test('should throw and exception if the ID is not on the database', async () => {
            const nonExistingUserId = 3;
            expect(async () => await mysqlUserRepository.deleteById(nonExistingUserId)).rejects.toThrow();
        });
    });
});