import ErrorWithStatus from "../../shared/domain/errorWithStatus";
import { GameInOrder } from "./gameInOrderModel";

export class GameInOrderRequest implements Omit<GameInOrder, 'price'>{
    constructor(
        readonly id: number,
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
    }
}