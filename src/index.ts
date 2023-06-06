import express from 'express';
import { gameRouter } from './games/infrastructure/rest-api/gameRouter';
import { userRouter } from './users/infrastructure/rest-api/users/userRouter';
import { authRouter } from './users/infrastructure/rest-api/auth/authRouter';
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

    const port = PORT;
    app.listen(port, () => {
        console.log(`[APP] - Starting application on port ${port}`);
    });
};

initApp();