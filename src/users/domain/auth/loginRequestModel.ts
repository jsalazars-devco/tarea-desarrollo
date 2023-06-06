import ErrorWithStatus from "../../../shared/domain/errorWithStatus";
// import { UserDbRequest } from "../users/userDbRequestModel";
import { User } from "../users/userModel";
import { LoginResponse } from "./loginResponseModel";
// import jwt from "jsonwebtoken";

export class LoginRequest implements Pick<User, 'username' | 'password'>{
    constructor(
        readonly username: string,
        readonly password: string,
    ) {
        if (
            typeof username !== 'string'
            || typeof password !== 'string'
        ) {
            const error = new ErrorWithStatus('Invalid input');
            error.status = 403;
            throw error;
        }
    }

    returnLoginResponse(): LoginResponse | null {
        return null;
    }

}