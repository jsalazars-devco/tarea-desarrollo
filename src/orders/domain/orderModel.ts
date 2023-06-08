import ErrorWithStatus from '../../shared/domain/errorWithStatus';
import { GameInOrder } from './gameInOrderModel';
import { emailPattern } from '../../utils';

export interface Customer {
    firstName: string,
    lastName: string,
    email: string,
    phone: number,
}

export class Order {
    readonly totalAmount: number;
    readonly completed: boolean;

    constructor(
        readonly id: number,
        readonly customer: Customer,
        readonly games: GameInOrder[],
    ) {
        if (Number.isNaN(id) || id < 0) {
            const error = new ErrorWithStatus('Invalid ID: Must be a positive number');
            error.status = 403;
            throw error;
        }
        else if (
            !(customer.firstName
                && customer.lastName
                && customer.email
                && customer.phone)
            || Number.isNaN(customer.phone)
            || typeof customer.phone !== 'number'
            || customer.phone < 0
            || !emailPattern.test(customer.email)
            || String(customer.phone).length !== 10
        ) {
            const error = new ErrorWithStatus('Invalid customer');
            error.status = 403;
            throw error;
        }
        else if (
            !games.every(game => game instanceof GameInOrder)
            || games.some(game => game.quantity <= 0)
        ) {
            const error = new ErrorWithStatus('Invalid quantity');
            error.status = 403;
            throw error;
        }

        this.totalAmount = games.reduce((previousAmount, nextGame) => previousAmount + nextGame.price * nextGame.quantity, 0);
        this.completed = false;
    }
}
