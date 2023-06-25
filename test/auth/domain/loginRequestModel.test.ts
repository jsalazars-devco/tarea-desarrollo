import { LoginRequest } from '../../../src/auth/domain/loginRequestModel';

describe('LoginRequestModel', () => {
    test('should create a new game instance', () => {
        const loginRequest = new LoginRequest('username', 'password');
        expect(loginRequest.username).toBe('username');
        expect(loginRequest.password).toBe('password');
    });

    test('should throw an exception if the username is not a string', () => {
        expect(() => new LoginRequest(123 as any, 'password')).toThrow();
    });

    test('should throw an exception if the password is not a string', () => {
        expect(() => new LoginRequest('username', 123 as any)).toThrow();
    });
});