import { LoginResponse } from './loginResponseModel';
import { LoginRequest } from './loginRequestModel';
import { UserResponse } from '../users/userResponseModel';

export interface AuthRepository {
    loginUser(login: LoginRequest): Promise<LoginResponse | null>;
    verifyUser(token: string): Promise<UserResponse | null>;
}