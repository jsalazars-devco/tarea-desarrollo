import { UserResponse } from './userResponseModel';
import { UserRequest } from './userRequestModel';

export interface UserRepository {
    findAll(): Promise<UserResponse[] | null>;
    create(game: UserRequest): Promise<UserResponse | null>;
    findById(gameId: number): Promise<UserResponse | null>;
    updateById(gameId: number, game: UserRequest): Promise<UserResponse | null>;
    createWithId(gameId: number, game: UserRequest): Promise<UserResponse | null>;
    deleteById(gameId: number): Promise<null>;
}