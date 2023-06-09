import MysqlDatabaseConnection from '../../../shared/infrastructure/mysqlConnection';
import { Order } from '../../domain/orderModel';
import { OrderRequest } from '../../domain/orderRequestModel';
import { OrderRepository } from '../../domain/orderRepository';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import {
    CREATE, CREATE_GAMES_IN_ORDER, CREATE_WITH_ID, DELETE_BY_ID,
    DELETE_GAMES_IN_ORDER, DELETE_GAME_IN_ORDER_BY_ID, FIND_ALL, FIND_BY_ID,
    FIND_GAMES_IN_ORDER, FIND_GAME_IN_ORDER_BY_ID, PAY_BY_ID,
    UPDATE_BY_ID, UPDATE_GAME_IN_ORDER
} from './querys';
import ErrorWithStatus from '../../../shared/domain/errorWithStatus';
import { GameInOrder } from '../../domain/gameInOrderModel';
import { OrderRequestWithId } from '../../domain/orderRequestWithIdModel';

export class MysqlOrderRepository implements OrderRepository {

    private executeMysqlQuery: MysqlDatabaseConnection['execute'];

    constructor(
        readonly mysqlDatabaseConnection: MysqlDatabaseConnection
    ) {

        this.executeMysqlQuery = mysqlDatabaseConnection.execute.bind(mysqlDatabaseConnection);
    }

    async findAll(): Promise<Order[] | null> {

        const ordersInDb = await this.executeMysqlQuery(FIND_ALL, []) as RowDataPacket[];


        const orders = ordersInDb.map((order: RowDataPacket) => {
            if (order.games) {
                const games = order.games.split(',').map((game: string) => {
                    const gameInfo = game.split(':');
                    return new GameInOrder(
                        Number(gameInfo[0]),
                        Number(gameInfo[1]),
                        Number(gameInfo[2]),
                    );
                });

                return new Order(
                    order.id,
                    order.customer,
                    games,
                    Boolean(order.completed),
                );
            }
            else {
                return new Order(
                    order.id,
                    order.customer,
                    [],
                    Boolean(order.completed),
                );
            }
        });

        return orders;
    }

    async create(order: OrderRequest): Promise<Order | null> {

        const newOrder = await this.executeMysqlQuery(CREATE, [order.customer, order.completed]) as ResultSetHeader;

        try {
            await Promise.all(order.games.map(async (game) =>
                await this.executeMysqlQuery(CREATE_GAMES_IN_ORDER, [newOrder.insertId, ...Object.values(game)]) as ResultSetHeader
            ));
        } catch (error: any) {
            await this.executeMysqlQuery(DELETE_BY_ID, [newOrder.insertId]);
            throw error;
        }

        const createdOrder = await this.executeMysqlQuery(FIND_BY_ID, [newOrder.insertId]) as RowDataPacket[];

        if (createdOrder[0].games) {
            const games = createdOrder[0].games.split(',').map((game: string) => {
                const gameInfo = game.split(':');
                return new GameInOrder(
                    Number(gameInfo[0]),
                    Number(gameInfo[1]),
                    Number(gameInfo[2]),
                );

            });

            return new Order(
                createdOrder[0].id,
                createdOrder[0].customer,
                games,
                Boolean(createdOrder[0].completed),
            );
        }
        else {
            return new Order(
                createdOrder[0].id,
                createdOrder[0].customer,
                [],
                Boolean(createdOrder[0].completed),
            );
        }
    }

    async findById(orderId: number): Promise<Order | null> {

        const order = await this.executeMysqlQuery(FIND_BY_ID, [orderId]) as RowDataPacket[];

        if (order.length === 0) {
            const error = new ErrorWithStatus('Invalid ID');
            error.status = 403;
            throw error;
        }

        if (order[0].games) {
            const games = order[0].games.split(',').map((game: string) => {
                const gameInfo = game.split(':');
                return new GameInOrder(
                    Number(gameInfo[0]),
                    Number(gameInfo[1]),
                    Number(gameInfo[2]),
                );
            });

            return new Order(
                order[0].id,
                order[0].customer,
                games,
                Boolean(order[0].completed),
            );
        }
        else {
            return new Order(
                order[0].id,
                order[0].customer,
                [],
                Boolean(order[0].completed),
            );
        }
    }

    async updateById(orderId: number, order: OrderRequest): Promise<Order | null> {

        const orderOnDb = await this.executeMysqlQuery(FIND_BY_ID, [orderId]) as RowDataPacket[];

        if (orderOnDb.length === 0) {
            return null;
        }

        await this.executeMysqlQuery(UPDATE_BY_ID, [order.customer, orderId]);

        if (order.games.length === 0) {
            await this.executeMysqlQuery(DELETE_GAMES_IN_ORDER, [orderId]);
        }
        else {
            const gamesInOrder = await this.executeMysqlQuery(FIND_GAMES_IN_ORDER, [orderId]) as RowDataPacket[];

            await Promise.all(gamesInOrder.map(async (gameId) => {
                if (
                    !order.games.some(game => game.id === gameId.game_id)
                ) {
                    return await this.executeMysqlQuery(DELETE_GAME_IN_ORDER_BY_ID, [orderId, gameId.game_id]);
                }

                return null;
            }));

            await Promise.all(order.games.map(async (game) => {
                const gameAlreadyOnDb = await this.executeMysqlQuery(FIND_GAME_IN_ORDER_BY_ID, [orderId, game.id]) as RowDataPacket[];

                if (gameAlreadyOnDb.length > 0) {
                    return await this.executeMysqlQuery(UPDATE_GAME_IN_ORDER, [game.quantity, orderId, game.id]) as ResultSetHeader;
                }
                return await this.executeMysqlQuery(CREATE_GAMES_IN_ORDER, [orderId, ...Object.values(game)]) as ResultSetHeader;
            }));
        }

        const data = await this.executeMysqlQuery(FIND_BY_ID, [orderId]) as RowDataPacket[];

        if (data[0].games) {
            const games = data[0].games.split(',').map((game: string) => {
                const gameInfo = game.split(':');
                return new GameInOrder(
                    Number(gameInfo[0]),
                    Number(gameInfo[1]),
                    Number(gameInfo[2]),
                );
            });

            return new Order(
                data[0].id,
                data[0].customer,
                games,
                Boolean(data[0].completed),
            );
        }
        else {
            return new Order(
                data[0].id,
                data[0].customer,
                [],
                Boolean(data[0].completed),
            );
        }
    }

    async createWithId(orderId: number, order: OrderRequest): Promise<Order | null> {

        const orderRequest = new OrderRequestWithId(
            orderId,
            order.customer,
            order.games,
        );

        await this.executeMysqlQuery(CREATE_WITH_ID, [orderRequest.id, orderRequest.customer, orderRequest.completed]) as ResultSetHeader;

        try {
            await Promise.all(orderRequest.games.map(async (game) =>
                await this.executeMysqlQuery(CREATE_GAMES_IN_ORDER, [orderRequest.id, game.id, game.quantity]) as ResultSetHeader
            ));
        } catch (error: any) {
            await this.executeMysqlQuery(DELETE_BY_ID, [orderRequest.id]);
            throw error;
        }

        const data = await this.executeMysqlQuery(FIND_BY_ID, [orderRequest.id]) as RowDataPacket[];

        if (data[0].games) {
            const games = data[0].games.split(',').map((game: string) => {
                const gameInfo = game.split(':');
                return new GameInOrder(
                    Number(gameInfo[0]),
                    Number(gameInfo[1]),
                    Number(gameInfo[2]),
                );
            });

            return new Order(
                data[0].id,
                data[0].customer,
                games,
                Boolean(data[0].completed),
            );
        }
        else {
            return new Order(
                data[0].id,
                data[0].customer,
                [],
                Boolean(data[0].completed),
            );
        }

    }

    async deleteById(orderId: number): Promise<null> {

        const data = await this.executeMysqlQuery(FIND_BY_ID, [orderId]) as RowDataPacket[];

        if (data.length === 0) {
            const error = new ErrorWithStatus('Invalid ID');
            error.status = 403;
            throw error;
        }

        await this.executeMysqlQuery(DELETE_GAMES_IN_ORDER, [orderId]);
        await this.executeMysqlQuery(DELETE_BY_ID, [orderId]);
        return null;
    }

    async completeById(orderId: number): Promise<Order | null> {

        const orderOnDb = await this.executeMysqlQuery(FIND_BY_ID, [orderId]) as RowDataPacket[];

        if (orderOnDb.length === 0) {
            const error = new ErrorWithStatus('Invalid ID');
            error.status = 403;
            throw error;
        }

        await this.executeMysqlQuery(PAY_BY_ID, [orderId]);

        const data = await this.executeMysqlQuery(FIND_BY_ID, [orderId]) as RowDataPacket[];

        if (data[0].games) {
            const games = data[0].games.split(',').map((game: string) => {
                const gameInfo = game.split(':');
                return new GameInOrder(
                    Number(gameInfo[0]),
                    Number(gameInfo[1]),
                    Number(gameInfo[2]),
                );
            });

            return new Order(
                data[0].id,
                data[0].customer,
                games,
                Boolean(data[0].completed),
            );
        }
        else {
            return new Order(
                data[0].id,
                data[0].customer,
                [],
                Boolean(data[0].completed),
            );
        }
    }
}