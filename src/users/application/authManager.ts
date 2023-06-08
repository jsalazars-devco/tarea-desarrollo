import ErrorWithStatus from '../../shared/domain/errorWithStatus';
import { AuthRepository } from '../domain/auth/authRepository';
import { LoginRequest } from '../domain/auth/loginRequestModel';
import { LoginResponse } from '../domain/auth/loginResponseModel';
import { TokenRequest } from '../domain/auth/tokenRequestModel';
import { User } from '../domain/users/userModel';
import { UserResponse } from '../domain/users/userResponseModel';

export class AuthManager {
    constructor(
        private readonly authRepository: AuthRepository,
    ) { }

    async login(loginRequest: any): Promise<LoginResponse | null> {
        const login = new LoginRequest(
            loginRequest.username,
            loginRequest.password
        );
        const user = await this.authRepository.loginUser(login);

        if (!user) {
            const error = new ErrorWithStatus('Invalid username or password');
            error.status = 401;
            throw error;
        }

        if (
            !(await User.verifyPassword(login.password, user.password, user.salt))
            && login.password !== user.password
        ) {
            const error = new ErrorWithStatus('Invalid username or password');
            error.status = 401;
            throw error;
        }

        return new LoginResponse(
            user.id,
            user.username,
            user.admin,
        );
    }

    async me(token: string): Promise<UserResponse | null> {
        const tokenUserInfo = new TokenRequest(token).getTokenInfo();
        const user = await this.authRepository.verifyUser(tokenUserInfo.id);
        return user;
    }
}