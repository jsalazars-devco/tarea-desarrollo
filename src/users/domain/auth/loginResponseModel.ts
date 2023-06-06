import { JWT_EXPIRATION_TIME, JWT_SECRET_KEY } from '../../../../config';
import ErrorWithStatus from '../../../shared/domain/errorWithStatus';
import jwt from 'jsonwebtoken';

export class LoginResponse {
    readonly token: string;

    constructor(
        readonly id: number,
        readonly username: string,
        readonly admin: boolean,
    ) {
        if (
            typeof id !== 'number'
            || id < 0
            || typeof username !== 'string'
            || typeof admin !== 'boolean'
        ) {
            const error = new ErrorWithStatus('Invalid input');
            error.status = 403;
            throw error;
        }

        const payload = {
            id,
            username,
            admin,
        };
        const options = { expiresIn: JWT_EXPIRATION_TIME };

        this.token = jwt.sign(payload, JWT_SECRET_KEY, options);
    }
}