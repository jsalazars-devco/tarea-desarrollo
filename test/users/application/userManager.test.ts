import { UserResponse } from '../../../src/users/domain/userResponseModel';
import { UserRequest } from '../../../src/users/domain/userRequestModel';
import { UserManager } from '../../../src/users/application/userManager';
import MysqlConnection from '../../../src/shared/infrastructure/mysqlConnection';
import { MysqlUserRepository } from '../../../src/users/infrastructure/mysqlRepository/mysqlUserRepository';

jest.mock('../../../src/users/domain/userRequestModel');

jest.mock('../../../src/shared/infrastructure/mysqlConnection');
jest.mock('../../../src/users/infrastructure/mysqlRepository/mysqlUserRepository');

describe('UserManager', () => {
    let userManager: UserManager;

    const mockMysqlConnection = MysqlConnection.getInstance() as jest.Mocked<MysqlConnection>;
    const mockUserRepository = new MysqlUserRepository(mockMysqlConnection) as jest.Mocked<MysqlUserRepository>;

    mockUserRepository.findAll.mockResolvedValue([new UserResponse(1, 'admin', true)]);
    mockUserRepository.create.mockResolvedValue(new UserResponse(2, 'username', false));
    mockUserRepository.findById.mockImplementation((userId) => {
        if (userId === 1) return Promise.resolve(new UserResponse(1, 'admin', true));
        return Promise.resolve(null);
    });
    mockUserRepository.updateById.mockImplementation((userId, user) => {
        if (userId === 2) return Promise.resolve(new UserResponse(2, user.username, user.admin));
        return Promise.resolve(null);
    });
    mockUserRepository.createWithId.mockImplementation((userId, user) => {
        return Promise.resolve(new UserResponse(userId, user.username, user.admin));
    });
    mockUserRepository.deleteById.mockResolvedValue(null);

    const mockedReturnUserDbRequest = jest.fn().mockReturnValue({
        username: 'username',
        password: 'password',
        admin: false
    });

    (UserRequest as jest.Mock).mockImplementation(() => {
        return ({
            returnUserDbRequest: mockedReturnUserDbRequest,
        });
    });

    beforeEach(() => {
        userManager = new UserManager(mockUserRepository);
    });

    describe('findAllUsers', () => {
        test('should return an user array', async () => {
            const result = await userManager.findUsers();
            expect(result).toBeInstanceOf(Array);
            expect(result?.every((user) => user instanceof UserResponse)).toBe(true);
        });
    });

    describe('createUser', () => {
        test('should return an user if the user information is correct', async () => {

            const user = {
                username: 'username',
                password: 'password',
                admin: false
            };
            const createdUser = await userManager.createUser(user);
            expect(createdUser).toBeInstanceOf(UserResponse);
            expect(createdUser?.id).toBe(2);
            expect(createdUser?.username).toBe(user.username);
            expect(createdUser?.admin).toBe(user.admin);
        });
    });

    describe('findUserById', () => {
        test('should return the user when a user with that id exists', async () => {
            const existingUserId = 1;
            const existingUser = await userManager.findUserById(existingUserId);
            expect(existingUser).toBeInstanceOf(UserResponse);
            expect(existingUser?.id).toBe(existingUserId);
        });

        test('should return null when the user does not exist', async () => {
            const nonExistingUserId = 10;
            expect(await userManager.findUserById(nonExistingUserId)).toBeNull();
        });
    });

    describe('updateUserById', () => {
        test('should return the user modified when a user with that id exists', async () => {
            const user = {
                username: 'username',
                password: 'password',
                admin: false
            };
            const existingUserId = 2;
            const updatedUser = await userManager.updateUserById(existingUserId, user);
            expect(updatedUser).toBeInstanceOf(UserResponse);
            expect(updatedUser?.id).toBe(existingUserId);
            expect(updatedUser?.username).toBe(user.username);
            expect(updatedUser?.admin).toBe(user.admin);
        });

        test('should return null when the user does not exist', async () => {
            const user = {
                username: 'username',
                password: 'password',
                admin: false
            };
            const nonExistingUserId = 10;
            expect(await userManager.updateUserById(nonExistingUserId, user)).toBeNull();
        });
    });

    describe('createUserWithId', () => {
        test('should return the user created when a user with the given id', async () => {
            const user = {
                username: 'username',
                password: 'password',
                admin: false
            };
            const existingUserId = 2;
            const updatedUser = await userManager.createUserWithId(existingUserId, user);
            expect(updatedUser).toBeInstanceOf(UserResponse);
            expect(updatedUser?.id).toBe(existingUserId);
            expect(updatedUser?.username).toBe(user.username);
            expect(updatedUser?.admin).toBe(user.admin);
        });
    });

    describe('deleteById', () => {
        test('should return null', async () => {
            const userId = 1;
            expect(await userManager.deleteUserById(userId)).toBeNull();
            expect(mockedReturnUserDbRequest).toHaveBeenCalled();
        });
    });
});