import MysqlDatabaseConnection from '../../../shared/infrastructure/mysqlConnection';
import { Order } from '../../domain/orderModel';
import { OrderRequest } from '../../domain/orderRequestModel';
import { OrderRepository } from '../../domain/orderRepository';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { CREATE, CREATE_WITH_ID, DELETE_BY_ID, FIND_ALL, FIND_BY_ID, FIND_BY_NAME, UPDATE_BY_ID } from './querys';
import ErrorWithStatus from '../../../shared/domain/errorWithStatus';
import { GameInOrder } from '../../domain/gameInOrderModel';

export class MysqlOrderRepository implements OrderRepository {

    private executeMysqlQuery: MysqlDatabaseConnection['execute'];

    constructor(
        readonly mysqlDatabaseConnection: MysqlDatabaseConnection
    ) {

        this.executeMysqlQuery = mysqlDatabaseConnection.execute.bind(mysqlDatabaseConnection);
    }

    async findAll(): Promise<Order[] | null> {

        const data = await this.executeMysqlQuery(FIND_ALL, []) as RowDataPacket[];

        const orders = data.map((order: RowDataPacket) => new Order(
            order.id,
            order.customer,
            order.games,
        ));

        return orders;
    }

    async create(order: OrderRequest): Promise<Order | null> {

        const orderRequest = new OrderRequest(
            order.customer,
            order.games,
        );

        const values = Object.values(orderRequest);
        const result = await this.executeMysqlQuery(CREATE, values) as ResultSetHeader;
        const data = await this.executeMysqlQuery(FIND_BY_ID, [result.insertId]) as RowDataPacket;

        const newOrder = new Order(
            data[0].id,
            data[0].customer,
            data[0].games,
        );

        return newOrder;
    }

    async findById(orderId: number): Promise<Order | null> {

        const data = await this.executeMysqlQuery(FIND_BY_ID, [orderId]) as RowDataPacket[];

        if (data.length === 0) {
            const error = new ErrorWithStatus('Invalid ID');
            error.status = 403;
            throw error;
        }

        const order = new Order(
            data[0].id,
            data[0].customer,
            data[0].games,
        );

        return order;
    }

    async updateById(orderId: number, order: OrderRequest): Promise<Order | null> {

        const orderOnDb = await this.executeMysqlQuery(FIND_BY_ID, [orderId]) as RowDataPacket[];

        if (orderOnDb.length === 0) {
            return null;
        }

        const values = Object.values(new OrderRequest(
            order.customer,
            order.games,
        ));

        values.push(orderId);

        await this.executeMysqlQuery(UPDATE_BY_ID, values);
        const data = await this.executeMysqlQuery(FIND_BY_ID, [orderId]) as RowDataPacket[];

        const updatedOrder = new Order(
            data[0].id,
            data[0].customer,
            data[0].games,
        );

        return updatedOrder;

    }

    async createWithId(orderId: number, order: OrderRequest): Promise<Order | null> {

        const newData = new Order(
            orderId,
            order.customer,
            order.games as GameInOrder[],
        );

        const values = Object.values(newData);

        await this.executeMysqlQuery(CREATE_WITH_ID, values) as ResultSetHeader;
        const data = await this.executeMysqlQuery(FIND_BY_ID, [orderId]) as RowDataPacket[];

        const createdOrder = new Order(
            data[0].id,
            data[0].customer,
            data[0].games,
        );

        return createdOrder;

    }

    async deleteById(orderId: number): Promise<null> {

        const data = await this.executeMysqlQuery(FIND_BY_ID, [orderId]) as RowDataPacket[];

        if (data.length === 0) {
            const error = new ErrorWithStatus('Invalid ID');
            error.status = 403;
            throw error;
        }

        await this.executeMysqlQuery(DELETE_BY_ID, [orderId]);
        return null;
    }
}