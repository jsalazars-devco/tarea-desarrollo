import { Request, Response } from "express";
import { UserManager } from "../../../application/userManager";

export class UserController {

    constructor(
        private readonly userManager: UserManager
    ) { }

    async findUsers(_req: Request, res: Response) {
        try {
            const users = await this.userManager.findUsers();
            res.status(200);
            res.send(users);
        } catch (error: any) {
            res.status(error.status);
            res.send(error.message);
        }
    }

    async createUser(req: Request, res: Response) {
        try {
            const user = await this.userManager.createUser(req.body);
            res.status(201);
            res.send(user);
        } catch (error: any) {
            res.status(error.status);
            res.send(error.message);
        }
    }

    async findUserById(req: Request, res: Response) {
        try {
            const user = await this.userManager.findUserById(Number(req.params.id));
            res.status(200);
            res.send(user);
        } catch (error: any) {
            res.status(error.status);
            res.send(error.message);
        }
    }

    async updateOrCreateUserById(req: Request, res: Response) {
        try {
            const updatedUser = await this.userManager.updateUserById(Number(req.params.id), req.body);
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
        } catch (error: any) {
            res.status(error.status);
            res.send(error.message);
        }
    }

    async deleteUserById(req: Request, res: Response) {
        try {
            await this.userManager.deleteUserById(Number(req.params.id));
            res.status(200);
            res.set('Content-Type', 'text/plain');
            res.send(`User with ID: "${req.params.id}" deleted`);
        } catch (error: any) {
            res.status(error.status);
            res.send(error.message);
        }
    }

}