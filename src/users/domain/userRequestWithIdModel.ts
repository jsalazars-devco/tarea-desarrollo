import { User } from './userModel';
import ErrorWithStatus from '../../shared/domain/errorWithStatus';
import { UserDbRequest } from './userDbRequestModel';

export class UserRequestWithId {
    constructor(
        readonly id: number,
        readonly username: string,
        readonly password: string,
        readonly admin: boolean,
    ) {
        if (typeof id !== 'number' || Number.isNaN(id) || id < 0) {
            const error = new ErrorWithStatus('Invalid ID: Must be a positive number');
            error.status = 403;
            throw error;
        } else if (
            typeof username !== 'string'
            || typeof password !== 'string'
            || typeof admin !== 'boolean'
        ) {
            const error = new ErrorWithStatus('Invalid user input');
            error.status = 403;
            throw error;
        }
    }

    public async returnUserDbRequest(): Promise<UserDbRequest> {
        const hashedPassword = await User.hashPassword(this.password);
        return new UserDbRequest(
            this.username,
            hashedPassword,
            this.admin
        );
    }
}