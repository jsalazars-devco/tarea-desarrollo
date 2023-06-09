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
import { OrderRequestWithId } from '../../domain/orderRequestWithIdModel';
import { orderGamesAdapter } from './mysqlOrderGamesAdapter';

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
            return orderGamesAdapter(order);
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

        return orderGamesAdapter(createdOrder[0]);
    }

    async findById(orderId: number): Promise<Order | null> {

        const order = await this.executeMysqlQuery(FIND_BY_ID, [orderId]) as RowDataPacket[];

        if (order.length === 0) {
            const error = new ErrorWithStatus('Invalid ID');
            error.status = 403;
            throw error;
        }

        return orderGamesAdapter(order[0]);
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

        return orderGamesAdapter(data[0]);
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

        return orderGamesAdapter(data[0]);
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

    async completeById(orderId: number): Promise<null> {

        const orderOnDb = await this.executeMysqlQuery(FIND_BY_ID, [orderId]) as RowDataPacket[];

        if (orderOnDb.length === 0) {
            const error = new ErrorWithStatus('Invalid ID');
            error.status = 403;
            throw error;
        }

        await this.executeMysqlQuery(PAY_BY_ID, [orderId]);
        return null;
    }
}