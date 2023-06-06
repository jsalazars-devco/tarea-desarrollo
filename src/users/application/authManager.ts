import { AuthRepository } from "../domain/auth/authRepository";
import { LoginRequest } from "../domain/auth/loginRequestModel";
import { LoginResponse } from "../domain/auth/loginResponseModel";

export class AuthManager {
    constructor(
        private readonly authRepository: AuthRepository,
    ) { }

    async login(login: LoginRequest): Promise<LoginResponse | null> {
        const user = await this.authRepository.loginUser(login);
        return user;
    }

    async logout(token: string): Promise<null> {
        await this.authRepository.logoutUser(token);
        return null;
    }

    async me(token: string): Promise<LoginResponse | null> {
        const user = await this.authRepository.verifyUser(token);
        return user;
    }
}