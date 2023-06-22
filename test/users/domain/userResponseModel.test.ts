import { UserResponse } from '../../../src/users/domain/userResponseModel';

describe('UserResponseModel', () => {
    test('should create a new user instance', () => {
        const user = new UserResponse(1, 'admin', true);

        expect(user.id).toBe(1);
        expect(user.username).toBe('admin');
        expect(user.admin).toBe(true);
    });

    test('should throw an exception if the ID is not a number', () => {
        expect(() => new UserResponse('1' as any, 'admin', true)).toThrow();
    });

    test('should throw an exception if the name is not a string', () => {
        expect(() => new UserResponse(1, 123 as any, true)).toThrow();
    });

    test('should throw an exception if the admin attribute is not a boolean', () => {
        expect(() => new UserResponse(1, 'admin', 'true' as any)).toThrow();
    });
});