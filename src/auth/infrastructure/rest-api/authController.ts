import { NextFunction, Request, Response } from 'express';
import { AuthManager } from '../../application/authManager';
import ErrorWithStatus from '../../../shared/domain/errorWithStatus';
import { TokenRequest } from '../../domain/tokenRequestModel';

export class AuthController {

    constructor(
        private readonly authManager: AuthManager
    ) { }

    login(req: Request, res: Response) {

        this.authManager.login(req.body).then((user) => {
            res.status(200);
            res.send(user);
        }).catch((error: any) => {
            res.status(error.status);
            res.send(error.message);
        });
    }

    logout(_req: Request, res: Response) {
        res.setHeader('Clear-Token', 'true');
        res.send('Logout successful');
    }

    me(req: Request, res: Response) {
        try {
            const token = req.header('Authorization')?.split(' ')[1];
            if (!token) {
                const error = new ErrorWithStatus('Authorization token missing');
                error.status = 401;
                throw error;
            }
            this.authManager.me(token).then((user) => {
                res.status(200);
                res.send(user);
            }).catch(error => {
                res.status(error.status);
                res.send(error.message);
            });
        } catch (error: any) {
            res.status(error.status);
            res.send(error.message);
        }
    }

    static verifyUser(req: any, res: Response, next: NextFunction) {
        try {
            const token = req.header('Authorization')?.split(' ')[1];
            if (!token) {
                const error = new ErrorWithStatus('Authorization token missing');
                error.status = 401;
                throw error;
            }
            req.user = (new TokenRequest(token)).getTokenInfo();
            next();
        } catch (error: any) {
            res.status(error.status);
            res.send(error.message);
        }
    }

    static verifyAdmin(req: any, res: Response, next: NextFunction) {
        if (req.user.admin) {
            return next();
        }
        else {
            res.status(403);
            res.send('You are not authorized to perform this operation!');
        }
    }
}