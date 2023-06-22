import { User } from '../../../src/users/domain/userModel';
import bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('UserModel', () => {
    test('should create a new user instance', () => {
        const user = new User(1, 'admin', 'hashedPassword', true);

        expect(user.id).toBe(1);
        expect(user.username).toBe('admin');
        expect(user.password).toBe('hashedPassword');
        expect(user.admin).toBe(true);
    });

    test('should throw an exception if the ID is not a number', () => {
        expect(() => new User('1' as any, 'admin', 'hashedPassword', true)).toThrow();
    });

    test('should throw an exception if the name is not a string', () => {
        expect(() => new User(1, 123 as any, 'hashedPassword', true)).toThrow();
    });

    test('should throw an exception if the password is not a string', () => {
        expect(() => new User(1, 'admin', 123 as any, true)).toThrow();
    });

    test('should throw an exception if the admin attribute is not a boolean', () => {
        expect(() => new User(1, 'admin', 'hashedPassword', 'true' as any)).toThrow();
    });

    const mockGenSalt = jest.fn().mockReturnValue('salt');
    const mockHash = jest.fn().mockImplementation((_password, _salt) => {
        if (mockHash.mock.calls.length === 1) {
            return 'hashedPassword';
        }
        throw new Error();
    });
    bcrypt.genSalt = mockGenSalt;
    bcrypt.hash = mockHash;

    test('should return the hashed password', async () => {
        const password = 'password';
        expect(await User.hashPassword(password)).toBe('hashedPassword');
    });

    test('should throw an exception if the hashing algorithm failed', () => {
        const password = 'password';

        expect(async () => await User.hashPassword(password)).rejects.toThrow();
    });

    const mockCompare = jest.fn().mockImplementation(() => {
        if (mockCompare.mock.calls.length === 1) {
            return true;
        } else if (mockCompare.mock.calls.length === 2) {
            return false;
        }
        throw new Error();
    });
    bcrypt.compare = mockCompare;

    test('should return true when the hash comes from the password', async () => {
        const password = 'password';
        const hashedPassword = 'hashedPassword';

        expect(await User.verifyPassword(password, hashedPassword)).toBe(true);
    });

    test('should return false when the hash does not comes from the password', async () => {
        const password = 'password1';
        const hashedPassword = 'hashedPassword';

        expect(await User.verifyPassword(password, hashedPassword)).toBe(false);
    });

    test('should throw an exception if the comparing algorithm failed', async () => {
        const password = 'password1';
        const hashedPassword = 'hashedPassword';
        await expect(User.verifyPassword(password, hashedPassword)).rejects.toThrow();
    });
});