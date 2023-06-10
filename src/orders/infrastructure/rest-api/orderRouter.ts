import express from 'express';
import { orderController } from '../../dependencies';
import { corsWithOptions } from '../../../shared/infrastructure/cors';
import { AuthController } from '../../../auth/infrastructure/rest-api/authController';

const orderRouter = express.Router();

orderRouter.route('/')
    .get(
        corsWithOptions,
        AuthController.verifyUser,
        orderController.findOrders.bind(orderController)
    )
    .post(
        corsWithOptions,
        AuthController.verifyUser,
        orderController.createOrder.bind(orderController)
    );

orderRouter.route('/:id')
    .get(
        corsWithOptions,
        AuthController.verifyUser,
        orderController.findOrderById.bind(orderController)
    )
    .put(
        corsWithOptions,
        AuthController.verifyUser,
        orderController.updateOrCreateOrderById.bind(orderController)
    )
    .delete(
        corsWithOptions,
        AuthController.verifyUser,
        orderController.deleteOrderById.bind(orderController)
    );

orderRouter.route('/:id/complete')
    .put(
        corsWithOptions,
        AuthController.verifyUser,
        orderController.completeOrderById.bind(orderController)
    );

export { orderRouter };