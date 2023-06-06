import ErrorWithStatus from "../../../shared/domain/errorWithStatus";
import { User } from "../users/userModel";

export class LoginResponse implements Pick<User, 'id' | 'username'>{
    constructor(
        readonly id: number,
        readonly username: string,
        readonly token: string,
    ) {
        if (
            typeof username !== 'string'
            || typeof token !== 'string'
        ) {
            const error = new ErrorWithStatus('Invalid input');
            error.status = 403;
            throw error;
        }
    }
}