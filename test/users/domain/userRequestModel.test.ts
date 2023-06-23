import { UserRequest } from '../../../src/users/domain/userRequestModel';
import { User } from '../../../src/users/domain/userModel';
import { UserDbRequest } from '../../../src/users/domain/userDbRequestModel';

jest.mock('../../../src/users/domain/userModel');

describe('UserRequestModel', () => {
    test('should create a new user request instance', () => {
        const user = new UserRequest('admin', 'password', true);

        expect(user.username).toBe('admin');
        expect(user.password).toBe('password');
        expect(user.admin).toBe(true);
    });

    test('should throw an exception if the name is not a string', () => {
        expect(() => new UserRequest(123 as any, 'hashedPassword', true)).toThrow();
    });

    test('should throw an exception if the password is not a string', () => {
        expect(() => new UserRequest('admin', 123 as any, true)).toThrow();
    });

    test('should throw an exception if the admin attribute is not a boolean', () => {
        expect(() => new UserRequest('admin', 'hashedPassword', 'true' as any)).toThrow();
    });

    const mockHashPassword = jest.fn().mockReturnValue('hashedPassword');
    User.hashPassword = mockHashPassword;

    test('should return the hashed password', async () => {
        const user = {
            username: 'username',
            password: 'password',
            admin: false,
        };
        const userDbRequest = await new UserRequest(user.username, user.password, user.admin).returnUserDbRequest();
        expect(userDbRequest).toBeInstanceOf(UserDbRequest);
        expect(userDbRequest.username).toBe(user.username);
        expect(userDbRequest.password).not.toBe(user.password);
        expect(userDbRequest.admin).toBe(user.admin);
    });
});