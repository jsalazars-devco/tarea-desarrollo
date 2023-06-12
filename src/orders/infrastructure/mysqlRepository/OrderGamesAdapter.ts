import { RowDataPacket } from 'mysql2/promise';
import { GameInOrder } from '../../domain/gameInOrderModel';
import { Order } from '../../domain/orderModel';

export const orderGamesAdapter = (data: RowDataPacket): Order => {

    if (data.games) {
        const games = data.games.split(',').map((game: string) => {
            const gameInfo = game.split(':');
            return new GameInOrder(
                Number(gameInfo[0]),
                Number(gameInfo[1]),
                Number(gameInfo[2]),
            );
        });

        return new Order(
            data.id,
            data.customer,
            games,
            Boolean(data.completed),
        );
    }
    else {
        return new Order(
            data.id,
            data.customer,
            [],
            Boolean(data.completed),
        );
    }
};