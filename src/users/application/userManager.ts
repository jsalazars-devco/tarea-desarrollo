import { UserDbRequest } from '../domain/userDbRequestModel';
import { UserRepository } from '../domain/userRepository';
import { UserRequest } from '../domain/userRequestModel';
import { UserResponse } from '../domain/userResponseModel';

export class UserManager {
    constructor(
        private readonly userRepository: UserRepository,
    ) { }

    async findUsers(): Promise<UserResponse[] | null> {
        const users = await this.userRepository.findAll();
        return users;
    }

    async createUser(user: UserRequest): Promise<UserResponse | null> {
        const userToCreate: UserDbRequest = await new UserRequest(
            user.username,
            user.password,
            user.admin,
        ).returnUserDbRequest();
        const newUser = await this.userRepository.create(userToCreate);
        return newUser;
    }

    async findUserById(userId: number): Promise<UserResponse | null> {
        const user = await this.userRepository.findById(userId);
        return user;
    }

    async updateUserById(userId: number, user: UserRequest): Promise<UserResponse | null> {
        const userToUpdate = await new UserRequest(
            user.username,
            user.password,
            user.admin,
        ).returnUserDbRequest();
        const updatedUser = await this.userRepository.updateById(userId, userToUpdate);
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