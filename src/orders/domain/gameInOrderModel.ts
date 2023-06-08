import ErrorWithStatus from '../../shared/domain/errorWithStatus';

export class GameInOrder {
    constructor(
        readonly id: number,
        readonly price: number,
        readonly quantity: number,
    ) {
        if (
            !(Number.isFinite(id)
                && typeof id === 'number'
                && id > 0)
        ) {
            const error = new ErrorWithStatus('Invalid game ID');
            error.status = 403;
            throw error;
        }
        if (
            !(Number.isFinite(quantity)
                && typeof quantity === 'number'
                && quantity > 0)
        ) {
            const error = new ErrorWithStatus('Invalid game quantity');
            error.status = 403;
            throw error;
        }
        if (
            !(Number.isFinite(price)
                && typeof price === 'number'
                && price > 0)
        ) {
            const error = new ErrorWithStatus('Invalid game price');
            error.status = 403;
            throw error;
        }
    }
}