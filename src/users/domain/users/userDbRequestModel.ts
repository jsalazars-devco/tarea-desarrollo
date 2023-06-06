import { User } from './userModel';
import ErrorWithStatus from '../../../shared/domain/errorWithStatus';

export class UserDbRequest implements Omit<User, 'id'> {
    constructor(
        readonly username: string,
        readonly password: string,
        readonly salt: string,
        readonly admin: boolean,
    ) {
        if (
            typeof username !== 'string'
            || typeof password !== 'string'
            || typeof salt !== 'string'
            || typeof admin !== 'boolean'
        ) {
            const error = new ErrorWithStatus('Invalid input');
            error.status = 403;
            throw error;
        }
    }
}