import { User } from './userModel';
import ErrorWithStatus from '../../shared/domain/errorWithStatus';

export class UserResponse implements Omit<User, 'password' | 'salt'> {
    constructor(
        readonly id: number,
        readonly username: string,
        readonly admin: boolean,
    ) {
        if (Number.isNaN(id) || id < 0) {
            const error = new ErrorWithStatus('Invalid ID: Must be a positive number');
            error.status = 403;
            throw error;
        }
        else if (
            typeof username !== 'string'
            || typeof admin !== 'boolean'
        ) {
            const error = new ErrorWithStatus('Invalid input');
            error.status = 403;
            throw error;
        }
    }
}