import { User } from './userModel';
import ErrorWithStatus from '../../../shared/domain/errorWithStatus';
import { UserDbRequest } from './userDbRequestModel';

export class UserRequest implements Omit<User, 'id' | 'salt'> {
    constructor(
        readonly username: string,
        readonly password: string,
        readonly admin: boolean,
    ) {
        if (
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
        const { salt, hashedPassword } = await User.hashPassword(this.password);
        if (this.admin) return new UserDbRequest(
            this.username,
            this.password,
            salt,
            this.admin
        );
        return new UserDbRequest(
            this.username,
            hashedPassword,
            salt,
            this.admin
        );
    }
}