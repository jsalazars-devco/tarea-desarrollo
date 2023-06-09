import { GameInOrder } from './gameInOrderModel';
import { Customer } from './customerInterface';
import { checkCompleted, checkCustomer, checkGamesInOrder, checkOrderId } from './attributeChecker';
import { Game } from '../../games/domain/gameModel';
import ErrorWithStatus from '../../shared/domain/errorWithStatus';

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

    public static canBeCompleted(order: Order, games: Game[]): boolean {
        games.forEach(game => {
            const gameInOrder = order.games.find(g => g.id === game.id);
            if (game.stock < gameInOrder!.quantity) {
                const error = new ErrorWithStatus(`Order cannot be paid: Stock of game ${game.id} insufficient`);
                error.status = 403;
                throw error;
            }
        });
        return true;
    };
}
