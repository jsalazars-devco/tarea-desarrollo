import ErrorWithStatus from '../../shared/domain/errorWithStatus';
import bcrypt from 'bcryptjs';

export class User {
    constructor(
        readonly id: number,
        readonly username: string,
        readonly password: string,
        readonly salt: string,
        readonly admin: boolean,
    ) {
        if (Number.isNaN(id) || id < 0) {
            const error = new ErrorWithStatus('Invalid ID: Must be a positive number');
            error.status = 403;
            throw error;
        }
        if (
            typeof username !== 'string'
            || typeof password !== 'string'
            || typeof salt !== 'string'
            || typeof admin !== 'boolean'
        ) {
            const error = new ErrorWithStatus('Invalid user input');
            error.status = 403;
            throw error;
        }
    }

    public static hashPassword = async (password: string): Promise<{ salt: string; hashedPassword: string; }> => {
        const saltRounds = 10;

        try {
            const salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(password, salt);
            return { salt, hashedPassword };
        } catch (error) {
            throw new Error('Password hashing failed');
        }
    };

    public static verifyPassword = async (
        password: string,
        hashedPassword: string,
        salt: string
    ): Promise<boolean> => {
        try {
            const hash = await bcrypt.hash(password, salt);
            return hash === hashedPassword;
        } catch (error) {
            throw new Error('Password verification failed');
        }
    };
}