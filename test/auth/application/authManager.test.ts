import { LoginResponse } from '../../../src/auth/domain/loginResponseModel';
import { AuthManager } from '../../../src/auth/application/authManager';
import MysqlConnection from '../../../src/shared/infrastructure/mysqlConnection';
import { MysqlAuthRepository } from '../../../src/auth/infrastructure/mysqlRepository/mysqlAuthRepository';
import { User } from '../../../src/users/domain/userModel';
import { UserResponse } from '../../../src/users/domain/userResponseModel';
import jwt from 'jsonwebtoken';

jest.mock('../../../src/shared/infrastructure/mysqlConnection');
jest.mock('../../../src/auth/infrastructure/mysqlRepository/mysqlAuthRepository');

describe('AuthManager', () => {
    let authManager: AuthManager;

    const mockMysqlConnection = MysqlConnection.getInstance() as jest.Mocked<MysqlConnection>;
    const mockAuthRepository = new MysqlAuthRepository(mockMysqlConnection) as jest.Mocked<MysqlAuthRepository>;

    beforeEach(() => {
        authManager = new AuthManager(mockAuthRepository);
    });

    describe('login', () => {
        test('should return a login response', async () => {
            mockAuthRepository.loginUser
                .mockResolvedValue(new User(
                    1,
                    'username',
                    'password',
                    false,
                ));
            const spyUserVerifyPassword = jest.spyOn(User, 'verifyPassword');
            spyUserVerifyPassword.mockResolvedValue(true);

            const login = {
                username: 'username',
                password: 'password'
            };
            const result = await authManager.login(login);
            expect(result).toBeInstanceOf(LoginResponse);
            expect(result?.username).toBe(login.username);
            expect(result).toHaveProperty('admin');
            expect(result).toHaveProperty('token');
        });

        test('should throw an exception if no user found', () => {
            mockAuthRepository.loginUser.mockResolvedValue(null);
            const spyUserVerifyPassword = jest.spyOn(User, 'verifyPassword');
            spyUserVerifyPassword.mockResolvedValue(true);

            const login = {
                username: 'username',
                password: 'password'
            };
            expect(async () => await authManager.login(login)).rejects.toThrow();
        });

        test('should throw an exception if the password is incorrect', () => {
            mockAuthRepository.loginUser
                .mockResolvedValue(new User(
                    1,
                    'username',
                    'password',
                    false,
                ));
            const spyUserVerifyPassword = jest.spyOn(User, 'verifyPassword');
            spyUserVerifyPassword.mockResolvedValue(false);

            const login = {
                username: 'username',
                password: 'password'
            };
            expect(async () => await authManager.login(login)).rejects.toThrow();
        });
    });

    describe('me', () => {
        test('should return a UserResponse if the token is correct', async () => {
            const mockVerify = jest.spyOn(jwt, 'verify');
            mockVerify.mockImplementation(() => Promise.resolve({
                iat: 1,
                exp: 1,
                id: 1,
                username: 'username',
                admin: true,
            }));
            mockAuthRepository.verifyUser.mockResolvedValue(new UserResponse(
                1,
                'username',
                false,
            ));
            const user = await authManager.me('token');
            expect(user).toBeInstanceOf(UserResponse);
            expect(user?.id).toBe(1);
            expect(user?.username).toBe('username');
            expect(user?.admin).toBe(false);
        });
    });
});