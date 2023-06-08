import { LoginRequest } from './loginRequestModel';
import { UserResponse } from '../users/userResponseModel';
import { User } from '../users/userModel';

export interface AuthRepository {
    loginUser(login: LoginRequest): Promise<User | null>;
    verifyUser(id: number): Promise<UserResponse | null>;
}