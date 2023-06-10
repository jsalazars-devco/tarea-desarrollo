import ErrorWithStatus from '../../shared/domain/errorWithStatus';
import { AuthRepository } from '../domain/authRepository';
import { LoginRequest } from '../domain/loginRequestModel';
import { LoginResponse } from '../domain/loginResponseModel';
import { TokenRequest } from '../domain/tokenRequestModel';
import { User } from '../../users/domain/userModel';
import { UserResponse } from '../../users/domain/userResponseModel';

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
            !(
                (user.admin && login.password === user.password)
                || await User.verifyPassword(login.password, user.password, user.salt)
            )
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