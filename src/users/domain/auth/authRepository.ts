import { LoginResponse } from "./loginResponseModel";
import { LoginRequest } from "./loginRequestModel";

export interface AuthRepository {
    loginUser(login: LoginRequest): Promise<LoginResponse | null>;
    logoutUser(token: string): Promise<null>;
    verifyUser(token: string): Promise<LoginResponse | null>;
}