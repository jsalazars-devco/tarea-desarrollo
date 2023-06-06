import { UserRepository } from '../domain/users/userRepository';
import { UserRequest } from '../domain/users/userRequestModel';
import { UserResponse } from '../domain/users/userResponseModel';

export class UserManager {
    constructor(
        private readonly userRepository: UserRepository,
    ) { }

    async findUsers(): Promise<UserResponse[] | null> {
        const users = await this.userRepository.findAll();
        return users;
    }

    async createUser(user: UserRequest): Promise<UserResponse | null> {
        const newUser = await this.userRepository.create(user);
        return newUser;
    }

    async findUserById(userId: number): Promise<UserResponse | null> {
        const user = await this.userRepository.findById(userId);
        return user;
    }

    async updateUserById(userId: number, user: UserRequest): Promise<UserResponse | null> {
        const updatedUser = await this.userRepository.updateById(userId, user);
        return updatedUser;
    }

    async createUserWithId(userId: number, user: UserRequest): Promise<UserResponse | null> {
        const createdUser = await this.userRepository.createWithId(userId, user);
        return createdUser;
    }

    async deleteUserById(userId: number): Promise<null> {
        await this.userRepository.deleteById(userId);
        return null;
    }
}