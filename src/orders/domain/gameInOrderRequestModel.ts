import ErrorWithStatus from "../../shared/domain/errorWithStatus";
import { GameInOrder } from "./gameInOrderModel";

export class GameInOrderRequest implements Omit<GameInOrder, 'price'>{
    constructor(
        readonly id: number,
        readonly quantity: number,
    ) {
        if (
            Number.isNaN(id)
            || typeof id !== 'number'
            || id < 0
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