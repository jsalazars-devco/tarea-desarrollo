import { Request, Response } from "express";
import { AuthManager } from "../../../application/authManager";
import ErrorWithStatus from "../../../../shared/domain/errorWithStatus";

export class AuthController {

    constructor(
        private readonly authManager: AuthManager
    ) { }

    async login(req: Request, res: Response) {
        try {
            const users = await this.authManager.login(req.body);
            res.status(200);
            res.send(users);
        } catch (error: any) {
            res.status(error.status);
            res.send(error.message);
        }
    }

    async logout(req: Request, res: Response) {
        try {
            const token = req.header('Authorization')?.split(' ')[1];
            if (!token) {
                console.error('Authorization token missing');
                const error = new ErrorWithStatus('Authorization token missing');
                error.status = 401;
                throw error;
            }
            const user = await this.authManager.logout(token);
            res.status(200);
            res.send(user);
        } catch (error: any) {
            res.status(error.status);
            res.send(error.message);
        }
    }

    async me(req: Request, res: Response) {
        try {
            const token = req.header('Authorization')?.split(' ')[1];
            if (!token) {
                console.error('Authorization token missing');
                const error = new ErrorWithStatus('Authorization token missing');
                error.status = 401;
                throw error;
            }
            const user = await this.authManager.me(req.body);
            res.status(200);
            res.send(user);
        } catch (error: any) {
            res.status(error.status);
            res.send(error.message);
        }
    }
}