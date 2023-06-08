import { Order } from '../domain/orderModel';
import { OrderRepository } from '../domain/orderRepository';
import { OrderRequest } from '../domain/orderRequestModel';

export class OrderManager {
    constructor(
        private readonly orderRepository: OrderRepository,
    ) { }

    async findOrders(): Promise<Order[] | null> {
        const orders = await this.orderRepository.findAll();
        return orders;
    }

    async createOrder(order: OrderRequest): Promise<Order | null> {
        const newOrder = await this.orderRepository.create(order);
        return newOrder;
    }

    async findOrderById(orderId: number): Promise<Order | null> {
        const order = await this.orderRepository.findById(orderId);
        return order;
    }

    async updateOrderById(orderId: number, order: OrderRequest): Promise<Order | null> {
        const updatedOrder = await this.orderRepository.updateById(orderId, order);
        return updatedOrder;
    }

    async createOrderWithId(orderId: number, order: OrderRequest): Promise<Order | null> {
        const createdOrder = await this.orderRepository.createWithId(orderId, order);
        return createdOrder;
    }

    async deleteOrderById(orderId: number): Promise<null> {
        await this.orderRepository.deleteById(orderId);
        return null;
    }
}