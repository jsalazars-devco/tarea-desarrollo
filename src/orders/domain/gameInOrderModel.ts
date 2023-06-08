import ErrorWithStatus from '../../shared/domain/errorWithStatus';
import { Game } from '../../games/domain/gameModel';

export class GameInOrder implements Pick<Game, 'id' | 'price'> {
    constructor(
        readonly id: number,
        readonly price: number,
        readonly quantity: number,
    ) {
        if (Number.isNaN(id) || id < 0) {
            const error = new ErrorWithStatus('Invalid ID: Must be a positive number');
            error.status = 403;
            throw error;
        }
        else if (
            Number.isNaN(price)
            || typeof price !== 'number'
            || price < 0
            || Number.isNaN(quantity)
            || typeof quantity !== 'number'
            || quantity < 0
        ) {
            const error = new ErrorWithStatus('Invalid input');
            error.status = 403;
            throw error;
        }
    }
}