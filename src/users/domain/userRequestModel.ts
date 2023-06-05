import { User } from './userModel';
import ErrorWithStatus from '../../shared/domain/errorWithStatus';

export class UserRequest implements Omit<User, 'id'> {
    constructor(
        readonly username: string,
        readonly password: string,
        readonly firstName: string,
        readonly lastName: string,
        readonly email: string,
        readonly phone: string,
    ) {
        if (
            typeof username !== 'string'
            || typeof password !== 'string'
            || typeof firstName !== 'string'
            || typeof lastName !== 'string'
            || typeof email !== 'string'
            || typeof phone !== 'string'
        ) {
            const error = new ErrorWithStatus('Invalid input');
            error.status = 403;
            throw error;
        }
    }
}