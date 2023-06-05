import { User } from "./userModel";
import { UserRequest } from "./userRequestModel";

export interface GameRepository {
    findAll(): Promise<User[] | null>;
    findById(gameId: number): Promise<User | null>;
    create(game: UserRequest): Promise<User | null>;
    updateById(gameId: number, game: UserRequest): Promise<User | null>;
    createWithId(gameId: number, game: UserRequest): Promise<User | null>;
    deleteById(gameId: number): Promise<null>;
}