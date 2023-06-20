import { UserRepository } from '../../../src/users/domain/userRepository';
import { UserResponse } from '../../../src/users/domain/userResponseModel';

export class MockUserRepository implements UserRepository {

    constructor() { }

    async findAll(): Promise<UserResponse[] | null> {
        return null;
    }
    async create(): Promise<UserResponse | null> {
        return null;
    }
    async findById(userId: number): Promise<UserResponse | null> {
        if (userId === 1) return new UserResponse(1, 'admin', true);
        return null;
    };
    async updateById(): Promise<UserResponse | null> {
        return null;
    }
    async createWithId(): Promise<UserResponse | null> {
        return null;
    }
    async deleteById(): Promise<null> {
        return null;
    }
}