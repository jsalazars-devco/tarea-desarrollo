import { LoginResponse } from '../../../src/auth/domain/loginResponseModel';

describe('LoginResponseModel', () => {
    test('should create a new game instance', () => {
        const loginRequest = new LoginResponse(2, 'username', false);
        expect(loginRequest.username).toBe('username');
        expect(loginRequest.admin).toBe(false);
        expect(loginRequest).toHaveProperty('token');
    });

    test('should throw an exception if the ID is not a number', () => {
        expect(() => new LoginResponse('2' as any, 'username', false)).toThrow();
    });

    test('should throw an exception if the username is not a string', () => {
        expect(() => new LoginResponse(2, 123 as any, false)).toThrow();
    });

    test('should throw an exception if the admin attribute is not a boolean', () => {
        expect(() => new LoginResponse(2, 'username', 'false' as any)).toThrow();
    });
});