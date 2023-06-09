import { Game } from '../../games/domain/gameModel';
import { GameRepository } from '../../games/domain/gameRepository';
import { Order } from '../domain/orderModel';
import { OrderRepository } from '../domain/orderRepository';
import { OrderRequest } from '../domain/orderRequestModel';

export class OrderManager {
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly gameRepository: GameRepository
    ) { }

    async findOrders(): Promise<Order[] | null> {
        const orders = await this.orderRepository.findAll();
        return orders;
    }

    async createOrder(order: OrderRequest): Promise<Order | null> {
        const orderRequest = new OrderRequest(
            order.customer,
            order.games,
        );
        const newOrder = await this.orderRepository.create(orderRequest);
        return newOrder;
    }

    async findOrderById(orderId: number): Promise<Order | null> {
        const order = await this.orderRepository.findById(orderId);
        return order;
    }

    async updateOrderById(orderId: number, order: OrderRequest): Promise<Order | null> {
        const orderRequest = new OrderRequest(
            order.customer,
            order.games,
        );
        const updatedOrder = await this.orderRepository.updateById(orderId, orderRequest);
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

    async completeOrderById(orderId: number): Promise<Order | null> {
        const order = await this.orderRepository.findById(orderId);
        const arrayOfGameIds = order!.games.map(game => game.id);
        const gamesInOrder = await this.gameRepository.findByArrayOfIds(arrayOfGameIds);
        const orderCanBePaid = Order.canBeCompleted(order!, gamesInOrder!);
        if (orderCanBePaid) {
            const modifiedGames = gamesInOrder?.map(game => {
                const gameInOrder = order!.games.find(g => g.id === game.id);
                return new Game(
                    game.id,
                    game.name,
                    game.stock - gameInOrder!.quantity,
                    game.price,
                    game.imageUrl,
                );
            });
            await this.gameRepository.updateByArray(modifiedGames!);
            const updatedOrder = await this.orderRepository.completeById(orderId);
            return updatedOrder;
        }
        return null;
    }
}