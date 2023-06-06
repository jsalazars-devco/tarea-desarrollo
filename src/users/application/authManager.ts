import { AuthRepository } from '../domain/auth/authRepository';
import { LoginRequest } from '../domain/auth/loginRequestModel';
import { LoginResponse } from '../domain/auth/loginResponseModel';
import { UserResponse } from '../domain/users/userResponseModel';

export class AuthManager {
    constructor(
        private readonly authRepository: AuthRepository,
    ) { }

    async login(login: LoginRequest): Promise<LoginResponse | null> {
        const user = await this.authRepository.loginUser(login);
        return user;
    }

    async me(token: string): Promise<UserResponse | null> {
        const user = await this.authRepository.verifyUser(token);
        return user;
    }
}