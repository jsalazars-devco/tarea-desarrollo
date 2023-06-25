import ErrorWithStatus from '../../shared/domain/errorWithStatus';
import jwt, { Algorithm, VerifyOptions } from "jsonwebtoken";
import { JWT_SECRET_KEY } from '../../../config';
import { LoginResponse } from './loginResponseModel';

interface IJwtVerify extends LoginResponse {
    iat: number;
    exp: number;
}

export class TokenRequest {
    private decodedToken: IJwtVerify;

    constructor(
        token: string,
    ) {
        if (
            typeof token !== 'string'
        ) {
            const error = new ErrorWithStatus('Invalid token');
            error.status = 401;
            throw error;
        }

        const verifyOptions: VerifyOptions = { algorithms: ['HS256'] as Algorithm[] };

        try {
            this.decodedToken = jwt.verify(token, JWT_SECRET_KEY, verifyOptions) as IJwtVerify;

        } catch (error: any) {
            if (error.expiredAt) {
                const err = new ErrorWithStatus('Token Expired');
                err.status = 401;
                throw err;
            }
            const err = new ErrorWithStatus('Invalid token');
            err.status = 401;
            throw err;
        }
    }

    getTokenInfo() {
        console.log(this.decodedToken);
        return this.decodedToken;
    }
}