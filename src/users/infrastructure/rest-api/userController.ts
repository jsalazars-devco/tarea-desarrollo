import { Request, Response } from 'express';
import { UserManager } from '../../application/userManager';

export class UserController {

    constructor(
        private readonly userManager: UserManager
    ) { }

    findUsers(_req: Request, res: Response) {
        this.userManager.findUsers().then(users => {
            res.status(200);
            res.send(users);
        }).catch((error: any) => {
            res.status(error.status);
            res.send(error.message);
        });
    }

    createUser(req: Request, res: Response) {
        this.userManager.createUser(req.body).then(user => {
            res.status(201);
            res.send(user);
        }).catch((error: any) => {
            res.status(error.status);
            res.send(error.message);
        });
    }

    findUserById(req: Request, res: Response) {
        this.userManager.findUserById(Number(req.params.id)).then(user => {
            res.status(200);
            res.send(user);
        }).catch((error: any) => {
            res.status(error.status);
            res.send(error.message);
        });
    }

    updateOrCreateUserById(req: Request, res: Response) {
        this.userManager.updateUserById(Number(req.params.id), req.body).then(async (updatedUser) => {
            if (updatedUser !== null) {
                res.status(200);
                res.send(updatedUser);
            }
            else {
                const createdUser = await this.userManager.createUserWithId(Number(req.params.id), req.body);
                if (createdUser !== null) {
                    res.status(201);
                    res.send(createdUser);
                }
            }
        }).catch((error: any) => {
            res.status(error.status);
            res.send(error.message);
        });
    }

    deleteUserById(req: Request, res: Response) {
        this.userManager.deleteUserById(Number(req.params.id)).then(() => {
            res.status(200);
            res.set('Content-Type', 'text/plain');
            res.send(`User with ID: "${req.params.id}" deleted`);
        }).catch((error: any) => {
            res.status(error.status);
            res.send(error.message);
        });
    }

}