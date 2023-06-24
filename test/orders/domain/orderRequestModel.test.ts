import { OrderRequest } from '../../../src/orders/domain/orderRequestModel';

describe('OrderRequestModel', () => {
    test('should create a new orderRequest instance', () => {
        const order = new OrderRequest(
            {
                firstName: 'john',
                lastName: 'doe',
                email: 'example@email.com',
                phone: 1234567890,
            },
            [
                {
                    id: 1,
                    quantity: 1,
                }
            ]
        );
        expect(order.customer).toStrictEqual({
            firstName: 'john',
            lastName: 'doe',
            email: 'example@email.com',
            phone: 1234567890,
        });
        expect(order.games).toBeInstanceOf(Array);
        expect(order.games.every(game => game.id && game.quantity)).toBe(true);
        expect(order.completed).toBe(false);
    });

    describe('customer attribute', () => {
        test('should throw an exception if the customer does not have the necesary attributes', () => {
            expect(() => new OrderRequest(
                {
                    firstName: 'john',
                    lastName: 'doe',
                    email: 'example@email.com',
                    phone: 1234567890,
                    badAttribute: 'badAttribute',
                } as any,
                [
                    {
                        id: 1,
                        quantity: 1,
                    }
                ],
            )).toThrow();
        });

        test('should throw an exception if the email is not a string or does not have the correct form', () => {
            expect(() => new OrderRequest(
                {
                    firstName: 'john',
                    lastName: 'doe',
                    email: 123 as any,
                    phone: 1234567890,
                },
                [
                    {
                        id: 1,
                        quantity: 1,
                    }
                ],
            )).toThrow();

            expect(() => new OrderRequest(
                {
                    firstName: 'john',
                    lastName: 'doe',
                    email: 'email.com',
                    phone: 1234567890,
                },
                [
                    {
                        id: 1,
                        quantity: 1,
                    }
                ],
            )).toThrow();
        });

        test('should throw an exception if the phone number is not a number or does not have 10 digits', () => {
            expect(() => new OrderRequest(
                {
                    firstName: 'john',
                    lastName: 'doe',
                    email: 'email.com',
                    phone: '1234567890' as any,
                },
                [
                    {
                        id: 1,
                        quantity: 1,
                    }
                ],
            )).toThrow();

            expect(() => new OrderRequest(
                {
                    firstName: 'john',
                    lastName: 'doe',
                    email: 'email.com',
                    phone: 123456789,
                },
                [
                    {
                        id: 1,
                        quantity: 1,
                    }
                ],
            )).toThrow();
        });
    });

    describe('games attribute', () => {
        test('should throw an exception if any game does not have the necesary attributes', () => {
            expect(() => new OrderRequest(
                {
                    firstName: 'john',
                    lastName: 'doe',
                    email: 'example@email.com',
                    phone: 1234567890,
                },
                [
                    {
                        id: 1,
                        quantity: 1,
                        badAttribute: 'badAttribute',
                    } as any
                ],
            )).toThrow();
        });

        test('should throw an exception if there are two games with the same ID', () => {
            expect(() => new OrderRequest(
                {
                    firstName: 'john',
                    lastName: 'doe',
                    email: 'example@email.com',
                    phone: 1234567890,
                },
                [
                    {
                        id: 1,
                        quantity: 1,
                    },
                    {
                        id: 1,
                        quantity: 1,
                    }
                ],
            )).toThrow();
        });
    });
});