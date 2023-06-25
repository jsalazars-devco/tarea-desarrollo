import { AuthController } from '../../../../src/auth/infrastructure/rest-api/authController';
import { AuthManager } from '../../../../src/auth/application/authManager';
import { LoginResponse } from '../../../../src/auth/domain/loginResponseModel';
import { UserResponse } from '../../../../src/users/domain/userResponseModel';
import jwt from 'jsonwebtoken';

describe('AuthController', () => {
    let authController: AuthController;
    let mockAuthManager: jest.Mocked<AuthManager>;
    let mockRequest: any;
    let mockResponse: any;
    let mockNextFunction: jest.Mock;

    beforeEach(() => {
        mockAuthManager = {
            login: jest.fn(),
            me: jest.fn(),
        } as unknown as jest.Mocked<AuthManager>;

        authController = new AuthController(mockAuthManager);

        mockRequest = {
            body: {},
            header: jest.fn(),
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            setHeader: jest.fn(),
        };

        mockNextFunction = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('login', () => {
        test('should send user data on successful login', async () => {
            const mockLoginResponse = new LoginResponse(1, 'username', false);
            mockAuthManager.login.mockResolvedValue(mockLoginResponse);

            authController.login(mockRequest, mockResponse);

            await new Promise(resolve => setTimeout(resolve, 0));
            expect(mockAuthManager.login).toHaveBeenCalledWith(mockRequest.body);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.send).toHaveBeenCalledWith(mockLoginResponse);
        });

        test('should send error message and status on failed login', async () => {
            const mockError: any = new Error('Invalid credentials');
            mockError.status = 401;
            mockAuthManager.login.mockRejectedValue(mockError);

            authController.login(mockRequest, mockResponse);

            await new Promise(resolve => setTimeout(resolve, 0));
            expect(mockAuthManager.login).toHaveBeenCalledWith(mockRequest.body);
            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.send).toHaveBeenCalledWith(mockError.message);
        });
    });

    describe('logout', () => {
        test('should set Clear-Token header and send success message', async () => {
            authController.logout(mockRequest, mockResponse);

            await new Promise(resolve => setTimeout(resolve, 0));
            expect(mockResponse.setHeader).toHaveBeenCalledWith('Clear-Token', 'true');
            expect(mockResponse.send).toHaveBeenCalledWith('Logout successful');
        });
    });

    describe('me', () => {
        test('should send user data on successful me request', async () => {
            const mockToken = 'mockToken';
            mockRequest.header.mockReturnValue(`Bearer ${mockToken}`);
            const mockUser = new UserResponse(1, 'username', false);
            mockAuthManager.me.mockResolvedValue(mockUser);

            authController.me(mockRequest, mockResponse);

            await new Promise(resolve => setTimeout(resolve, 0));
            expect(mockRequest.header).toHaveBeenCalledWith('Authorization');
            expect(mockAuthManager.me).toHaveBeenCalledWith(mockToken);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.send).toHaveBeenCalledWith(mockUser);
        });

        test('should send error message and status on missing token', async () => {
            mockRequest.header.mockReturnValue(undefined);
            authController.me(mockRequest, mockResponse);

            await new Promise(resolve => setTimeout(resolve, 0));
            expect(mockRequest.header).toHaveBeenCalledWith('Authorization');
            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.send).toHaveBeenCalledWith('Authorization token missing');
        });

        test('should send error message and status on failed me request', async () => {
            const mockToken = 'mockToken';
            mockRequest.header.mockReturnValue(`Bearer ${mockToken}`);
            const expectedError: any = new Error('Failed to retrieve user data');
            expectedError.status = 500;
            mockAuthManager.me.mockRejectedValue(expectedError);

            authController.me(mockRequest, mockResponse);

            await new Promise(resolve => setTimeout(resolve, 0));
            expect(mockRequest.header).toHaveBeenCalledWith('Authorization');
            expect(mockAuthManager.me).toHaveBeenCalledWith(mockToken);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.send).toHaveBeenCalledWith(expectedError.message);
        });
    });

    describe('verifyUser', () => {
        test('should set user property on request and call next function', async () => {
            const mockToken = 'mockToken';
            mockRequest.header.mockReturnValue(`Bearer ${mockToken}`);
            const mockTokenInfo = {
                iat: 1,
                exp: 1,
                id: 1,
                username: 'username',
                admin: true,
            };

            const mockVerify = jest.spyOn(jwt, 'verify');
            mockVerify.mockImplementation(() => ({
                iat: 1,
                exp: 1,
                id: 1,
                username: 'username',
                admin: true,
            }));

            AuthController.verifyUser(mockRequest, mockResponse, mockNextFunction);

            await new Promise(resolve => setTimeout(resolve, 0));
            expect(mockRequest.header).toHaveBeenCalledWith('Authorization');
            expect(mockRequest.user).toEqual(mockTokenInfo);
            expect(mockNextFunction).toHaveBeenCalled();
        });

        test('should send error message and status on missing token', async () => {
            mockRequest.header.mockReturnValue(undefined);
            const expectedError: any = new Error('Authorization token missing');
            expectedError.status = 401;

            AuthController.verifyUser(mockRequest, mockResponse, mockNextFunction);

            await new Promise(resolve => setTimeout(resolve, 0));
            expect(mockRequest.header).toHaveBeenCalledWith('Authorization');
            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.send).toHaveBeenCalledWith(expectedError.message);
            expect(mockNextFunction).not.toHaveBeenCalled();
        });
    });

    describe('verifyAdmin', () => {
        test('should call next function if user is admin', async () => {
            mockRequest.user = { admin: true };

            AuthController.verifyAdmin(mockRequest, mockResponse, mockNextFunction);

            await new Promise(resolve => setTimeout(resolve, 0));
            expect(mockNextFunction).toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalled();
            expect(mockResponse.send).not.toHaveBeenCalled();
        });

        test('should send error message and status if user is not admin', async () => {
            mockRequest.user = { admin: false };

            AuthController.verifyAdmin(mockRequest, mockResponse, mockNextFunction);

            await new Promise(resolve => setTimeout(resolve, 0));
            expect(mockNextFunction).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(403);
            expect(mockResponse.send).toHaveBeenCalledWith('You are not authorized to perform this operation!');
        });
    });
});
