import { Order } from './orderModel';
import { OrderRequest } from './orderRequestModel';

export interface OrderRepository {
    findAll(): Promise<Order[] | null>;
    findById(orderId: number): Promise<Order | null>;
    create(order: OrderRequest): Promise<Order | null>;
    updateById(orderId: number, order: OrderRequest): Promise<Order | null>;
    createWithId(orderId: number, order: OrderRequest): Promise<Order | null>;
    deleteById(orderId: number): Promise<null>;
    completeById(orderId: number): Promise<null>;
}