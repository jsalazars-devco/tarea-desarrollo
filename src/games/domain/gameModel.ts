import ErrorWithStatus from '../../shared/domain/errorWithStatus';

export class Game {
    constructor(
        readonly id: number,
        readonly name: string,
        readonly stock: number,
        readonly price: number,
        readonly imageUrl: string,
    ) {
        if (Number.isNaN(id) || id < 0) {
            const error = new ErrorWithStatus('Invalid ID: Must be a positive number');
            error.status = 403;
            throw error;
        }
        else if (
            typeof name !== 'string'
            || Number.isNaN(stock)
            || typeof stock !== 'number'
            || stock < 0
            || Number.isNaN(price)
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