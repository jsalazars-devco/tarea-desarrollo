import { TokenRequest } from '../../../src/auth/domain/tokenRequestModel';
import jwt from 'jsonwebtoken';

describe('TokenRequestModel', () => {
    test('should create a new TokenRequest instance', () => {
        const mockVerify = jest.spyOn(jwt, 'verify');
        mockVerify.mockImplementation(() => ({
            iat: 1,
            exp: 1,
            id: 1,
            username: 'username',
            admin: true,
        }));
        const tokenRequest = new TokenRequest('token');
        const tokenInfo = tokenRequest.getTokenInfo();
        expect(tokenRequest).toHaveProperty('decodedToken');
        expect(tokenInfo).toHaveProperty('id');
        expect(tokenInfo).toHaveProperty('username');
        expect(tokenInfo).toHaveProperty('admin');
        expect(tokenInfo).toHaveProperty('iat');
        expect(tokenInfo).toHaveProperty('exp');
        mockVerify.mockRestore();
    });

    test('should throw an exception if the token is not a string', () => {
        expect(() => new TokenRequest(123 as any)).toThrow();
    });

    test('should throw an exception if the token expired', () => {
        const mockVerify = jest.spyOn(jwt, 'verify');
        const mockError: any = new Error('Token expired');
        mockError.expiredAt = new Date('2023-06-30');
        mockVerify.mockImplementation(() => { throw mockError; });
        expect(() => new TokenRequest('expiredToken')).toThrow();
        mockVerify.mockRestore();
    });

    test('should throw an exception if the token is invalid', () => {
        const mockVerify = jest.spyOn(jwt, 'verify');
        mockVerify.mockImplementation(() => { throw new Error('Invalid Token'); });
        expect(() => new TokenRequest('invalid token')).toThrow();
        mockVerify.mockRestore();
    });
});