import { Game } from './gameModel';
import ErrorWithStatus from '../../shared/domain/errorWithStatus';

export class GameRequest implements Omit<Game, 'id'> {
    constructor(
        readonly name: string,
        readonly stock: number,
        readonly price: number,
        readonly imageUrl: string,
    ) {
        if (
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