import ErrorWithStatus from '../../shared/domain/errorWithStatus';

export class Game {
    constructor(
        readonly name: string,
        readonly stock: number,
        readonly price: number,
        readonly imageUrl: string,
        readonly id?: number,
    ) {
        if (id !== undefined) {
            if (
                typeof name !== 'string'
                || typeof stock !== 'number'
                || stock < 0
                || typeof price !== 'number'
                || price < 0
                || typeof imageUrl !== 'string'
                || typeof id !== 'number'
            ) {
                const error = new ErrorWithStatus('Invalid input');
                error.status = 403;
                throw error;
            }
        }
        else {
            if (
                typeof name !== 'string'
                || typeof stock !== 'number'
                || stock < 0
                || typeof price !== 'number'
                || price < 0
                || typeof imageUrl !== 'string'
            ) {
                const error = new ErrorWithStatus('Invalid input');
                error.status = 403;
                throw error;
            }
        }
    }
}