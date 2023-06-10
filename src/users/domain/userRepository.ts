import { UserResponse } from './userResponseModel';
import { UserDbRequest } from './userDbRequestModel';
import { UserRequest } from './userRequestModel';

export interface UserRepository {
    findAll(): Promise<UserResponse[] | null>;
    create(game: UserDbRequest): Promise<UserResponse | null>;
    findById(gameId: number): Promise<UserResponse | null>;
    updateById(gameId: number, game: UserDbRequest): Promise<UserResponse | null>;
    createWithId(gameId: number, game: UserRequest): Promise<UserResponse | null>;
    deleteById(gameId: number): Promise<null>;
}