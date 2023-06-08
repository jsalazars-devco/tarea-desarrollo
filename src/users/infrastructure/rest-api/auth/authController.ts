import { Request, Response } from 'express';
import { AuthManager } from '../../../application/authManager';
import ErrorWithStatus from '../../../../shared/domain/errorWithStatus';

export class AuthController {

    constructor(
        private readonly authManager: AuthManager
    ) { }

    async login(req: Request, res: Response) {
        try {
            const user = await this.authManager.login(req.body);
            res.status(200);
            res.send(user);
        } catch (error: any) {
            res.status(error.status);
            res.send(error.message);
        }
    }

    async logout(_req: Request, res: Response) {
        res.setHeader('Clear-Token', 'true');
        res.send('Logout successful');
    }

    async me(req: Request, res: Response) {
        try {
            const token = req.header('Authorization')?.split(' ')[1];
            if (!token) {
                const error = new ErrorWithStatus('Authorization token missing');
                error.status = 401;
                throw error;
            }
            const user = await this.authManager.me(token);
            res.status(200);
            res.send(user);
        } catch (error: any) {
            res.status(error.status);
            res.send(error.message);
        }
    }
}