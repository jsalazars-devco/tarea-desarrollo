import { Game } from '../../../src/games/domain/gameModel';
import { Order } from '../../../src/orders/domain/orderModel';

describe('OrderModel', () => {
    test('should create a new order instance', () => {
        const order = new Order(
            1,
            {
                firstName: 'john',
                lastName: 'doe',
                email: 'example@email.com',
                phone: 1234567890,
            },
            [
                {
                    id: 1,
                    price: 100000,
                    quantity: 1,
                }
            ],
            false
        );
        expect(order.id).toBe(1);
        expect(order.customer).toStrictEqual({
            firstName: 'john',
            lastName: 'doe',
            email: 'example@email.com',
            phone: 1234567890,
        });
        expect(order.games).toBeInstanceOf(Array);
        expect(order.games.every(game => game.id && game.price && game.quantity)).toBe(true);
        expect(order.completed).toBe(false);
        expect(order.totalAmount).toBe(100000);
    });

    test('should throw an exception if the ID is not a number', () => {
        expect(() => new Order(
            '1' as any,
            {
                firstName: 'john',
                lastName: 'doe',
                email: 'example@email.com',
                phone: 1234567890,
            },
            [
                {
                    id: 1,
                    price: 100000,
                    quantity: 1,
                }
            ],
            false
        )).toThrow();
    });

    describe('customer attribute', () => {
        test('should throw an exception if the customer does not have the necesary attributes', () => {
            expect(() => new Order(
                1,
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
                        price: 100000,
                        quantity: 1,
                    }
                ],
                false
            )).toThrow();
        });

        test('should throw an exception if the email is not a string or does not have the correct form', () => {
            expect(() => new Order(
                1,
                {
                    firstName: 'john',
                    lastName: 'doe',
                    email: 123 as any,
                    phone: 1234567890,
                },
                [
                    {
                        id: 1,
                        price: 100000,
                        quantity: 1,
                    }
                ],
                false
            )).toThrow();

            expect(() => new Order(
                1,
                {
                    firstName: 'john',
                    lastName: 'doe',
                    email: 'email.com',
                    phone: 1234567890,
                },
                [
                    {
                        id: 1,
                        price: 100000,
                        quantity: 1,
                    }
                ],
                false
            )).toThrow();
        });

        test('should throw an exception if the phone number is not a number or does not have 10 digits', () => {
            expect(() => new Order(
                1,
                {
                    firstName: 'john',
                    lastName: 'doe',
                    email: 'email.com',
                    phone: '1234567890' as any,
                },
                [
                    {
                        id: 1,
                        price: 100000,
                        quantity: 1,
                    }
                ],
                false
            )).toThrow();

            expect(() => new Order(
                1,
                {
                    firstName: 'john',
                    lastName: 'doe',
                    email: 'email.com',
                    phone: 123456789,
                },
                [
                    {
                        id: 1,
                        price: 100000,
                        quantity: 1,
                    }
                ],
                false
            )).toThrow();
        });
    });

    describe('games attribute', () => {
        test('should throw an exception if any game does not have the necesary attributes', () => {
            expect(() => new Order(
                1,
                {
                    firstName: 'john',
                    lastName: 'doe',
                    email: 'example@email.com',
                    phone: 1234567890,
                },
                [
                    {
                        id: 1,
                        price: 100000,
                        quantity: 1,
                        badAttribute: 'badAttribute',
                    } as any
                ],
                false
            )).toThrow();
        });

        test('should throw an exception if there are two games with the same ID', () => {
            expect(() => new Order(
                1,
                {
                    firstName: 'john',
                    lastName: 'doe',
                    email: 'example@email.com',
                    phone: 1234567890,
                },
                [
                    {
                        id: 1,
                        price: 100000,
                        quantity: 1,
                    },
                    {
                        id: 1,
                        price: 100000,
                        quantity: 1,
                    }
                ],
                false
            )).toThrow();
        });
    });

    test('should throw an exception if the completed attribute is not a boolean', () => {
        expect(() => new Order(
            1,
            {
                firstName: 'john',
                lastName: 'doe',
                email: 'example@email.com',
                phone: 1234567890,
            },
            [
                {
                    id: 1,
                    price: 100000,
                    quantity: 1,
                }
            ],
            'false' as any
        )).toThrow();
    });

    describe('canBeCompleted', () => {
        test('should return true if the stock of everygame on the order is bigger or equal than the quantity', () => {
            const order = new Order(
                1,
                {
                    firstName: 'john',
                    lastName: 'doe',
                    email: 'example@email.com',
                    phone: 1234567890,
                },
                [
                    {
                        id: 1,
                        price: 100000,
                        quantity: 1,
                    }
                ],
                false
            );
            const games = [new Game(1, 'name', 1, 100000, 'imageUrl')];
            expect(Order.canBeCompleted(order, games)).toBe(true);
        });

        test('should throw an exception if the stock is smaller than any game quantity in the order', () => {
            const order = new Order(
                1,
                {
                    firstName: 'john',
                    lastName: 'doe',
                    email: 'example@email.com',
                    phone: 1234567890,
                },
                [
                    {
                        id: 1,
                        price: 100000,
                        quantity: 1,
                    }
                ],
                false
            );
            const games = [new Game(1, 'name', 0, 100000, 'imageUrl')];
            expect(() => Order.canBeCompleted(order, games)).toThrow();
        });
    });
});