import { User } from "../../../src/users/domain/userModel";

describe('UserModel', () => {
    test('should create a new user instance', () => {
        const user = new User(1, 'admin', 'hashedPassword', true);

        expect(user.id).toBe(1);
        expect(user.username).toBe('admin');
        expect(user.password).toBe('hashedPassword');
        expect(user.admin).toBe(true);
    });

    test('should return a hashed password', async () => {
        const password = 'password';
        const hashedPassword = await User.hashPassword(password);

        expect(hashedPassword).not.toBe(password);
    });

    test('should return true when the hash comes from the password', async () => {
        const password = 'password';
        const hashedPassword = '$2y$10$vQv1yaqs3tBparCfa3ZzueuICm.zjWs9/AdKnIIVBAkUQrsbTh4Ja';

        expect(await User.verifyPassword(password, hashedPassword)).toBe(true);
    });

    test('should return false when the hash does not comes from the password', async () => {
        const password = 'password1';
        const hashedPassword = '$2y$10$vQv1yaqs3tBparCfa3ZzueuICm.zjWs9/AdKnIIVBAkUQrsbTh4Ja';

        expect(await User.verifyPassword(password, hashedPassword)).toBe(false);
    });
});