import { TokenRequest } from '../../../src/auth/domain/tokenRequestModel';

describe('TokenRequestModel', () => {
    test('should create a new game instance', () => {
        const tokenRequest = new TokenRequest('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhZG1pbiIsImFkbWluIjp0cnVlLCJpYXQiOjE2ODc2NDIzMDYsImV4cCI6NTI4NzY0MjMwNn0.wQK4tLhYKLoMTXeFxFiiP8e5xezF2i4QZxcRxJylpUw');
        expect(tokenRequest).toHaveProperty('decodedToken');
    });

    test('should return the token info', () => {
        const tokenInfo = new TokenRequest('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJhZG1pbiIsImFkbWluIjp0cnVlLCJpYXQiOjE2ODc2NDIzMDYsImV4cCI6NTI4NzY0MjMwNn0.wQK4tLhYKLoMTXeFxFiiP8e5xezF2i4QZxcRxJylpUw').getTokenInfo();
        expect(tokenInfo).toHaveProperty('id');
        expect(tokenInfo).toHaveProperty('username');
        expect(tokenInfo).toHaveProperty('admin');
        expect(tokenInfo).toHaveProperty('iat');
        expect(tokenInfo).toHaveProperty('exp');
    });

    test('should throw an exception if the token is not a string', () => {
        expect(() => new TokenRequest(123 as any)).toThrow();
    });

    test('should throw an exception if the token expired', () => {
        expect(() => new TokenRequest('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImFkbWluIjp0cnVlLCJpYXQiOjE2ODY2OTE5NDYsImV4cCI6MTY4NjY5NTU0Nn0.ClSeM6ThXuLgnmaqKi7lUjsm6n92miXW6bF4RqJDXZw')).toThrow();
    });

    test('should throw an exception if the token is invalid', () => {
        expect(() => new TokenRequest('invalid token')).toThrow();
    });
});