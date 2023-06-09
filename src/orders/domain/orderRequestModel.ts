import { Customer } from './customerInterface';
import { GameInOrderRequest } from './gameInOrderRequestModel';
import { checkCustomer, checkGamesInOrderRequest } from './attributeChecker';

export class OrderRequest {
    readonly completed: boolean;

    constructor(
        readonly customer: Customer,
        readonly games: GameInOrderRequest[],
    ) {
        checkCustomer(customer);

        checkGamesInOrderRequest(games);

        this.games = games.map(game => new GameInOrderRequest(
            game.id,
            game.quantity,
        ));

        this.completed = false;
    }
}