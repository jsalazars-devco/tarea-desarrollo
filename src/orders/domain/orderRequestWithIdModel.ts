import { Customer } from './customerInterface';
import { GameInOrderRequest } from './gameInOrderRequestModel';
import { checkCustomer, checkGamesInOrderRequest, checkOrderId } from './attributeChecker';

export class OrderRequestWithId {
    readonly completed: boolean;

    constructor(
        readonly id: number,
        readonly customer: Customer,
        readonly games: GameInOrderRequest[],
    ) {
        checkOrderId(id);

        checkCustomer(customer);

        checkGamesInOrderRequest(games);

        this.games = games.map(game => new GameInOrderRequest(
            game.id,
            game.quantity,
        ));

        this.completed = false;
    }
}