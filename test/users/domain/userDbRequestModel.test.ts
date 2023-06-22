import { UserDbRequest } from '../../../src/users/domain/userDbRequestModel';

describe('UserDbRequestModel', () => {
    test('should create a new user instance', () => {
        const user = new UserDbRequest('admin', 'password', true);

        expect(user.username).toBe('admin');
        expect(user.password).toBe('password');
        expect(user.admin).toBe(true);
    });

    test('should throw an exception if the name is not a string', () => {
        expect(() => new UserDbRequest(123 as any, 'hashedPassword', true)).toThrow();
    });

    test('should throw an exception if the password is not a string', () => {
        expect(() => new UserDbRequest('admin', 123 as any, true)).toThrow();
    });

    test('should throw an exception if the admin attribute is not a boolean', () => {
        expect(() => new UserDbRequest('admin', 'hashedPassword', 'true' as any)).toThrow();
    });
});