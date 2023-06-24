import MysqlDatabaseConnection from '../../../../src/shared/infrastructure/mysqlConnection';
import { Order } from '../../../../src/orders/domain/orderModel';
import { MysqlOrderRepository } from '../../../../src/orders/infrastructure/mysqlRepository/mysqlOrderRepository';
import * as QUERIES from '../../../../src/orders/infrastructure/mysqlRepository/queries';
import { OrderRequest } from '../../../../src/orders/domain/orderRequestModel';

describe('MysqlOrderRepository', () => {

    let mysqlOrderRepository: MysqlOrderRepository;
    const mockMysqlConnection = MysqlDatabaseConnection.getInstance();
    const spyMysqlConnectionExecute = jest.spyOn(mockMysqlConnection, 'execute');

    beforeEach(() => {
        spyMysqlConnectionExecute.mockImplementation((query, values): any => {
            if (query === QUERIES.FIND_ALL) {
                return Promise.resolve([
                    {
                        id: 1,
                        customer: {
                            firstName: 'john',
                            lastName: 'doe',
                            email: 'example@email.com',
                            phone: 1234567890,
                        },
                        games: '1:100000:1',
                        completed: 0,
                    }
                ]);
            }
            else if (query === QUERIES.FIND_BY_ID) {
                const id = values[0];
                if (id === 1) {
                    return Promise.resolve([
                        {
                            id: 1,
                            customer: {
                                firstName: 'john',
                                lastName: 'doe',
                                email: 'example@email.com',
                                phone: 1234567890,
                            },
                            games: '1:100000:1',
                            completed: 0,
                        }
                    ]);
                }
                else if (id === 2) {
                    return Promise.resolve([
                        {
                            id: 2,
                            customer: {
                                firstName: 'john',
                                lastName: 'doe',
                                email: 'example@email.com',
                                phone: 1234567890,
                            },
                            games: '',
                            completed: 0,
                        }
                    ]);

                }
                return Promise.resolve([]);
            }
            else if (
                query === QUERIES.CREATE
                || query === QUERIES.CREATE_WITH_ID
                || query === QUERIES.UPDATE_BY_ID
                || query === QUERIES.DELETE_BY_ID
                || query === QUERIES.UPDATE_GAME_IN_ORDER
                || query === QUERIES.DELETE_GAME_IN_ORDER_BY_ID
                || query === QUERIES.PAY_BY_ID
                || query === QUERIES.CREATE_GAMES_IN_ORDER
            ) {
                return Promise.resolve({
                    insertId: 2,
                });
            }
            else if (query === QUERIES.FIND_GAMES_IN_ORDER) {
                return Promise.resolve([{ game_id: 1 }]);
            }
            else if (query === QUERIES.FIND_GAME_IN_ORDER_BY_ID) {
                return Promise.resolve([{ order_id: 1, game_id: 1, quantity: 1 }]);
            }
        });

        mysqlOrderRepository = new MysqlOrderRepository(mockMysqlConnection);
    });

    describe('findAll', () => {
        test('should return a order array', async () => {
            const result = await mysqlOrderRepository.findAll();
            expect(result).toBeInstanceOf(Array);
            expect(result?.every((order) => order instanceof Order)).toBe(true);
        });
    });

    describe('create', () => {
        test('should return the new created order', async () => {
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
            const result = await mysqlOrderRepository.create(order);
            expect(result).toBeInstanceOf(Order);
            expect(result?.id).toBe(2);
            expect(result?.customer).toStrictEqual(order.customer);
            expect(result?.games).toBeInstanceOf(Array);
            expect(result?.games.every(game => game.id && game.price && game.quantity)).toBe(true);
            expect(result?.completed).toBe(false);
            expect(result).toHaveProperty('totalAmount');
        });

        test('should throw an exception if the ID of the game is not on the database', () => {
            const order = new OrderRequest(
                {
                    firstName: 'john',
                    lastName: 'doe',
                    email: 'example@email.com',
                    phone: 1234567890,
                },
                [
                    {
                        id: 2,
                        quantity: 1,
                    }
                ]
            );
            spyMysqlConnectionExecute.mockImplementation((query,): any => {
                if (query === QUERIES.CREATE) {
                    return Promise.resolve({
                        insertId: 2,
                    });
                }
                else if (query === QUERIES.CREATE_GAMES_IN_ORDER) {
                    return Promise.reject(new Error);
                }
            });
            expect(async () => await mysqlOrderRepository.create(order)).rejects.toThrow();
        });
    });

    describe('findById', () => {
        test('should return the order if the ID is on the database', async () => {
            const existingOrderId = 1;
            const existingOrder = await mysqlOrderRepository.findById(existingOrderId);
            expect(existingOrder).toBeInstanceOf(Order);
            expect(existingOrder?.id).toBe(existingOrderId);
        });

        test('should throw an exception if the ID is not on the database', () => {
            const nonExistingOrderId = 3;
            expect(async () => await mysqlOrderRepository.findById(nonExistingOrderId)).rejects.toThrow();
        });
    });

    describe('updateById', () => {
        test('should return the updated order if the ID is on the database', async () => {
            const existingOrderId = 1;
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
            const result = await mysqlOrderRepository.updateById(existingOrderId, order);
            expect(result).toBeInstanceOf(Order);
            expect(result?.id).toBe(existingOrderId);
            expect(result?.customer).toStrictEqual(order.customer);
            expect(result?.games).toBeInstanceOf(Array);
            expect(result?.games.every(game => game.id && game.price && game.quantity)).toBe(true);
            expect(result?.completed).toBe(false);
            expect(result).toHaveProperty('totalAmount');
        });

        test('should return the updated order with no games if the games attribute is empty', async () => {
            const existingOrderId = 1;
            const order = new OrderRequest(
                {
                    firstName: 'john',
                    lastName: 'doe',
                    email: 'example@email.com',
                    phone: 1234567890,
                },
                []
            );
            const result = await mysqlOrderRepository.updateById(existingOrderId, order);
            expect(result).toBeInstanceOf(Order);
            expect(result?.id).toBe(existingOrderId);
            expect(result?.customer).toStrictEqual(order.customer);
            expect(result?.games).toBeInstanceOf(Array);
            expect(result?.games.every(game => game.id && game.price && game.quantity)).toBe(true);
            expect(result?.completed).toBe(false);
            expect(result).toHaveProperty('totalAmount');
        });

        test('should return the updated order with different games than it had', async () => {
            const existingOrderId = 1;
            const order = new OrderRequest(
                {
                    firstName: 'john',
                    lastName: 'doe',
                    email: 'example@email.com',
                    phone: 1234567890,
                },
                [
                    {
                        id: 2,
                        quantity: 1,
                    }
                ]
            );
            spyMysqlConnectionExecute.mockImplementation((query,): any => {
                if (query === QUERIES.FIND_BY_ID) {
                    return Promise.resolve([
                        {
                            id: 1,
                            customer: {
                                firstName: 'john',
                                lastName: 'doe',
                                email: 'example@email.com',
                                phone: 1234567890,
                            },
                            games: '1:100000:1',
                            completed: 0,
                        }
                    ]);
                }
                else if (
                    query === QUERIES.UPDATE_BY_ID
                    || query === QUERIES.DELETE_GAME_IN_ORDER_BY_ID
                    || query === QUERIES.CREATE_GAMES_IN_ORDER
                ) {
                    return Promise.resolve({
                        insertId: 2,
                    });
                }
                else if (query === QUERIES.FIND_GAMES_IN_ORDER) {
                    return Promise.resolve([{ game_id: 1 }]);
                }
                else if (query === QUERIES.FIND_GAME_IN_ORDER_BY_ID) {
                    return Promise.resolve([]);
                }
            });
            const result = await mysqlOrderRepository.updateById(existingOrderId, order);
            expect(result).toBeInstanceOf(Order);
            expect(result?.id).toBe(existingOrderId);
            expect(result?.customer).toStrictEqual(order.customer);
            expect(result?.games).toBeInstanceOf(Array);
            expect(result?.games.every(game => game.id && game.price && game.quantity)).toBe(true);
            expect(result?.completed).toBe(false);
            expect(result).toHaveProperty('totalAmount');
        });

        test('should return null if the ID is not on the database', async () => {
            const nonExistingOrderId = 3;
            const values = new OrderRequest(
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
            expect(await mysqlOrderRepository.updateById(nonExistingOrderId, values)).toBeNull();
        });
    });

    describe('createWithId', () => {
        test('should return the created order with the specified ID', async () => {
            const newOrderId = 2;
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
            const result = await mysqlOrderRepository.createWithId(newOrderId, order);
            expect(result).toBeInstanceOf(Order);
            expect(result?.id).toBe(newOrderId);
            expect(result?.customer).toStrictEqual(order.customer);
            expect(result?.games).toBeInstanceOf(Array);
            expect(result?.games.every(game => game.id && game.price && game.quantity)).toBe(true);
            expect(result?.completed).toBe(false);
            expect(result).toHaveProperty('totalAmount');
        });

        test('should throw an exception if a there is an error creating the games in the order', async () => {
            const newOrderId = 2;
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
            spyMysqlConnectionExecute.mockImplementation((query,): any => {
                if (query === QUERIES.CREATE_WITH_ID || query === QUERIES.DELETE_BY_ID) {
                    return Promise.resolve({
                        insertId: 2,
                    });
                }
                else if (query === QUERIES.CREATE_GAMES_IN_ORDER) {
                    return Promise.reject(new Error);
                }
            });
            expect(async () => await mysqlOrderRepository.createWithId(newOrderId, order)).rejects.toThrow();
        });
    });

    describe('deleteById', () => {
        test('should return null if the ID is on the database', async () => {
            const existingOrderId = 2;
            expect(await mysqlOrderRepository.deleteById(existingOrderId)).toBeNull();
        });

        test('should throw and exception if the ID is not on the database', async () => {
            const nonExistingOrderId = 3;
            expect(async () => await mysqlOrderRepository.deleteById(nonExistingOrderId)).rejects.toThrow();
        });
    });

    describe('completeById', () => {
        test('should return null if the order ID is on the database', async () => {
            const existingOrderId = 1;
            expect(await mysqlOrderRepository.completeById(existingOrderId)).toBeNull();
        });

        test('should throw an exception if the order ID is not on the database', async () => {
            const nonExistingOrderId = 3;
            expect(async () => await mysqlOrderRepository.completeById(nonExistingOrderId)).rejects.toThrow();
        });
    });
});