import { Request, Response } from 'express';
import { OrderManager } from '../../application/orderManager';

export class OrderController {

    constructor(
        private readonly orderManager: OrderManager
    ) { }

    findOrders(_req: Request, res: Response) {
        this.orderManager.findOrders().then(orders => {
            res.status(200);
            res.send(orders);
        }).catch((error: any) => {
            res.status(error.status);
            res.send(error.message);
        });
    }

    createOrder(req: Request, res: Response) {
        this.orderManager.createOrder(req.body).then(order => {
            res.status(201);
            res.send(order);
        }).catch((error: any) => {
            res.status(error.status);
            res.send(error.message);
        });
    }

    findOrderById(req: Request, res: Response) {
        this.orderManager.findOrderById(Number(req.params.id)).then(order => {
            res.status(200);
            res.send(order);
        }).catch((error: any) => {
            res.status(error.status);
            res.send(error.message);
        });
    }

    updateOrCreateOrderById(req: Request, res: Response) {
        this.orderManager.updateOrderById(Number(req.params.id), req.body).then(async (updatedOrder) => {

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
        }).catch((error: any) => {
            res.status(error.status);
            res.send(error.message);
        });
    }

    deleteOrderById(req: Request, res: Response) {
        this.orderManager.deleteOrderById(Number(req.params.id)).then(() => {
            res.status(200);
            res.set('Content-Type', 'text/plain');
            res.send(`Order with ID: "${req.params.id}" deleted`);
        }).catch((error: any) => {
            res.status(error.status);
            res.send(error.message);
        });
    }

    completeOrderById(req: Request, res: Response) {
        this.orderManager.completeOrderById(Number(req.params.id)).then(() => {
            res.set('Content-Type', 'text/plain');
            res.send(`Order with ID: "${req.params.id}" completed`);
        }).catch((error: any) => {
            res.status(error.status);
            res.send(error.message);
        });
    }

}