import express from 'express';
import { orderController } from '../../dependencies';
import { corsWithOptions } from '../../../shared/infrastructure/cors';

const orderRouter = express.Router();

orderRouter.route('/')
    .get(
        corsWithOptions,
        orderController.findOrders.bind(orderController)
    )
    .post(
        corsWithOptions,
        orderController.createOrder.bind(orderController)
    );

orderRouter.route('/:id')
    .get(
        corsWithOptions,
        orderController.findOrderById.bind(orderController)
    )
    .put(
        corsWithOptions,
        orderController.updateOrCreateOrderById.bind(orderController)
    )
    .delete(
        corsWithOptions,
        orderController.deleteOrderById.bind(orderController)
    );

orderRouter.route('/:id/complete')
    .put(
        corsWithOptions,
        orderController.completeOrderById.bind(orderController)
    );

export { orderRouter };