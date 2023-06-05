import ErrorWithStatus from "../../shared/domain/errorWithStatus";

export class User {
    constructor(
        readonly id: number,
        readonly username: string,
        readonly password: string,
        readonly firstName: string,
        readonly lastName: string,
        readonly email: string,
        readonly phone: string,
    ) {
        if (Number.isNaN(id) || id < 0) {
            const error = new ErrorWithStatus('Invalid ID: Must be a positive number');
            error.status = 403;
            throw error;
        }
        else if (
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