import { UserRequestWithId } from '../../../src/users/domain/userRequestWithIdModel';
import { User } from '../../../src/users/domain/userModel';
import { UserDbRequest } from '../../../src/users/domain/userDbRequestModel';

jest.mock('../../../src/users/domain/userModel');

describe('UserRequestModel', () => {
    test('should create a new user instance', () => {
        const user = new UserRequestWithId(1, 'admin', 'password', true);

        expect(user.id).toBe(1);
        expect(user.username).toBe('admin');
        expect(user.password).toBe('password');
        expect(user.admin).toBe(true);
    });

    test('should throw an exception if the ID is not a number', () => {
        expect(() => new UserRequestWithId('1' as any, 'admin', 'hashedPassword', true)).toThrow();
    });

    test('should throw an exception if the name is not a string', () => {
        expect(() => new UserRequestWithId(1, 123 as any, 'hashedPassword', true)).toThrow();
    });

    test('should throw an exception if the password is not a string', () => {
        expect(() => new UserRequestWithId(1, 'admin', 123 as any, true)).toThrow();
    });

    test('should throw an exception if the admin attribute is not a boolean', () => {
        expect(() => new UserRequestWithId(1, 'admin', 'hashedPassword', 'true' as any)).toThrow();
    });

    const mockHashPassword = jest.fn().mockReturnValue('hashedPassword');
    User.hashPassword = mockHashPassword;

    test('should return the hashed password', async () => {
        const user = {
            id: 1,
            username: 'username',
            password: 'password',
            admin: false,
        };
        const userDbRequest = await new UserRequestWithId(user.id, user.username, user.password, user.admin).returnUserDbRequest();
        expect(userDbRequest).toBeInstanceOf(UserDbRequest);
        expect(userDbRequest.username).toBe(user.username);
        expect(userDbRequest.password).not.toBe(user.password);
        expect(userDbRequest.admin).toBe(user.admin);
    });
});