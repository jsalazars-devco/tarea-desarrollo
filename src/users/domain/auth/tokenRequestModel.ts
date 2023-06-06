import ErrorWithStatus from '../../../shared/domain/errorWithStatus';
import jwt, { Algorithm, VerifyOptions } from "jsonwebtoken";
import { JWT_SECRET_KEY } from '../../../../config';
import { LoginResponse } from './loginResponseModel';

interface IJwtVerify extends LoginResponse {
    iat: number;
    exp: number;
}

export class TokenRequest {
    readonly decodedToken: IJwtVerify;

    constructor(
        readonly token: string,
    ) {
        if (
            typeof token !== 'string'
        ) {
            const error = new ErrorWithStatus('Invalid token');
            error.status = 403;
            throw error;
        }

        const verifyOptions: VerifyOptions = { algorithms: ['HS256'] as Algorithm[] };

        try {
            this.decodedToken = jwt.verify(token, JWT_SECRET_KEY, verifyOptions) as IJwtVerify;

        } catch (error) {
            const err = new ErrorWithStatus('Invalid token');
            err.status = 403;
            throw error;
        }
    }

    getTokenInfo() {
        return this.decodedToken;
    }
}