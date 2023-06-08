import { Customer, Order } from './orderModel';
import ErrorWithStatus from '../../shared/domain/errorWithStatus';
import { emailPattern } from '../../utils';
import { GameInOrderRequest } from './gameInOrderRequestModel';

export class OrderRequest implements Pick<Order, 'customer'>{
    constructor(
        readonly customer: Customer,
        readonly games: GameInOrderRequest[],
    ) {
        if (
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
            !games.every(game => game instanceof GameInOrderRequest)
        ) {
            const error = new ErrorWithStatus('Invalid game');
            error.status = 403;
            throw error;
        }
    }
}