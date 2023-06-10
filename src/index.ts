import express from 'express';
import { gameRouter } from './games/infrastructure/rest-api/gameRouter';
import { orderRouter } from './orders/infrastructure/rest-api/orderRouter';
import { userRouter } from './users/infrastructure/rest-api/userRouter';
import { authRouter } from './auth/infrastructure/rest-api/authRouter';
import { PORT } from '../config';
import logger from 'morgan';

const initApp = () => {
    const app = express();

    app.use(logger('dev'));
    app.use(express.json());
    app.disable('x-powered-by');

    app.use('/api/games', gameRouter);
    app.use('/users', userRouter);
    app.use('/auth', authRouter);
    app.use('/api/orders', orderRouter);

    const port = PORT;
    app.listen(port, () => {
        console.log(`[APP] - Starting application on port ${port}`);
    });
};

initApp();