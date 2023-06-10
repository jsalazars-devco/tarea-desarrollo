import { LoginRequest } from './loginRequestModel';
import { UserResponse } from '../../users/domain/userResponseModel';
import { User } from '../../users/domain/userModel';

export interface AuthRepository {
    loginUser(login: LoginRequest): Promise<User | null>;
    verifyUser(id: number): Promise<UserResponse | null>;
}