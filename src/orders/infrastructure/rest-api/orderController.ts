import { Request, Response } from 'express';
import { OrderManager } from '../../application/orderManager';

export class OrderController {

    constructor(
        private readonly orderManager: OrderManager
    ) { }

    async findOrders(_req: Request, res: Response) {
        try {
            const orders = await this.orderManager.findOrders();
            res.status(200);
            res.send(orders);
        } catch (error: any) {
            res.status(error.status);
            res.send(error.message);
        }
    }

    async createOrder(req: Request, res: Response) {
        try {
            const order = await this.orderManager.createOrder(req.body);
            res.status(201);
            res.send(order);
        } catch (error: any) {
            res.status(error.status);
            res.send(error.message);
        }
    }

    async findOrderById(req: Request, res: Response) {
        try {
            const order = await this.orderManager.findOrderById(Number(req.params.id));
            res.status(200);
            res.send(order);
        } catch (error: any) {
            res.status(error.status);
            res.send(error.message);
        }
    }

    async updateOrCreateOrderById(req: Request, res: Response) {
        try {
            const updatedOrder = await this.orderManager.updateOrderById(Number(req.params.id), req.body);

            if (updatedOrder !== null) {
                res.status(200);
                res.send(updatedOrder);
            }
            else {
                const createdOrder = await this.orderManager.createOrderWithId(Number(req.params.id), req.body);
                if (createdOrder !== null) {
                    res.status(201);
                    res.send(createdOrder);
                }
            }
        } catch (error: any) {
            res.status(error.status);
            res.send(error.message);
        }
    }

    async deleteOrderById(req: Request, res: Response) {
        try {
            await this.orderManager.deleteOrderById(Number(req.params.id));
            res.status(200);
            res.set('Content-Type', 'text/plain');
            res.send(`Order with ID: "${req.params.id}" deleted`);
        } catch (error: any) {
            res.status(error.status);
            res.send(error.message);
        }
    }

}