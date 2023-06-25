import MysqlDatabaseConnection from '../../../../src/shared/infrastructure/mysqlConnection';
import { User } from '../../../../src/users/domain/userModel';
import { MysqlAuthRepository } from '../../../../src/auth/infrastructure/mysqlRepository/mysqlAuthRepository';
import * as QUERIES from '../../../../src/users/infrastructure/mysqlRepository/queries';
import { LoginRequest } from '../../../../src/auth/domain/loginRequestModel';
import { UserResponse } from '../../../../src/users/domain/userResponseModel';

describe('MysqlUserRepository', () => {

    const mockMysqlConnection = MysqlDatabaseConnection.getInstance();
    const spyMysqlConnectionExecute = jest.spyOn(mockMysqlConnection, 'execute');

    spyMysqlConnectionExecute.mockImplementation((query, values): any => {
        if (query === QUERIES.FIND_BY_ID) {
            const id = values[0];
            if (id === 1) {
                return Promise.resolve([{
                    id: 1,
                    username: 'username',
                    password: 'password',
                    admin: false,
                }]);
            }
            return Promise.resolve([]);
        }
        else if (query === QUERIES.FIND_BY_USERNAME) {
            const username = values[0];
            if (username === 'username') {
                return Promise.resolve([{
                    id: 1,
                    username: 'username',
                    password: 'password',
                    admin: false,
                }]);
            }
            return Promise.resolve([]);
        }
    });

    let mysqlAuthRepository: MysqlAuthRepository;
    beforeEach(() => {
        mysqlAuthRepository = new MysqlAuthRepository(mockMysqlConnection);
    });

    describe('loginUser', () => {
        test('should return a user if the username is on the database', async () => {
            const login = new LoginRequest('username', 'password');
            const result = await mysqlAuthRepository.loginUser(login);
            expect(result).toBeInstanceOf(User);
            expect(result?.username).toBe(login.username);
        });

        test('should throw an exception if the username is not on the database', async () => {
            const login = new LoginRequest('notExistingUsername', 'password');
            expect(async () => await mysqlAuthRepository.loginUser(login)).rejects.toThrow();
        });
    });

    describe('verifyUser', () => {
        test('should return the user if the ID is on the database', async () => {
            const existingUserId = 1;
            const existingUser = await mysqlAuthRepository.verifyUser(existingUserId);
            expect(existingUser).toBeInstanceOf(UserResponse);
            expect(existingUser?.id).toBe(existingUserId);
        });

        test('should throw an exception if the ID is not on the database', async () => {
            const nonExistingUserId = 3;
            expect(async () => await mysqlAuthRepository.verifyUser(nonExistingUserId)).rejects.toThrow();
        });
    });
});