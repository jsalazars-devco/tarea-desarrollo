import { GameInOrder } from './gameInOrderModel';
import { Customer } from './customerInterface';
import { checkCompleted, checkCustomer, checkGamesInOrder, checkOrderId } from './attributeChecker';

export class Order {
    readonly totalAmount: number;

    constructor(
        readonly id: number,
        readonly customer: Customer,
        readonly games: GameInOrder[],
        readonly completed: boolean,
    ) {
        checkOrderId(id);

        checkCustomer(customer);

        checkGamesInOrder(games);

        checkCompleted(completed);

        this.totalAmount = games.reduce((previousAmount, nextGame) => previousAmount + nextGame.price * nextGame.quantity, 0);
    }
}
