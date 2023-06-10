import ErrorWithStatus from '../../shared/domain/errorWithStatus';
import { User } from '../../users/domain/userModel';

export class LoginRequest implements Pick<User, 'username' | 'password'>{
    constructor(
        readonly username: string,
        readonly password: string,
    ) {
        if (
            typeof username !== 'string'
            || typeof password !== 'string'
        ) {
            const error = new ErrorWithStatus('Invalid input');
            error.status = 403;
            throw error;
        }
    }
}