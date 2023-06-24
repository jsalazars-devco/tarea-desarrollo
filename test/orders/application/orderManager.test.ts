import { Order } from '../../../src/orders/domain/orderModel';
import { OrderManager } from '../../../src/orders/application/orderManager';
import MysqlConnection from '../../../src/shared/infrastructure/mysqlConnection';
import { MysqlOrderRepository } from '../../../src/orders/infrastructure/mysqlRepository/mysqlOrderRepository';
import { MysqlGameRepository } from '../../../src/games/infrastructure/mysqlRepository/mysqlGameRepository';
import { Game } from '../../../src/games/domain/gameModel';

jest.mock('../../../src/shared/infrastructure/mysqlConnection');
jest.mock('../../../src/orders/infrastructure/mysqlRepository/mysqlOrderRepository');
jest.mock('../../../src/games/infrastructure/mysqlRepository/mysqlGameRepository');

describe('OrderManager', () => {
    let orderManager: OrderManager;

    const mockMysqlConnection = MysqlConnection.getInstance() as jest.Mocked<MysqlConnection>;

    const mockOrderRepository = new MysqlOrderRepository(mockMysqlConnection) as jest.Mocked<MysqlOrderRepository>;
    mockOrderRepository.findAll.mockResolvedValue([new Order(
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
    )]);
    mockOrderRepository.create.mockResolvedValue(new Order(
        2,
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
    ));
    mockOrderRepository.findById.mockImplementation((orderId) => {
        if (orderId === 1) return Promise.resolve(new Order(
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
        ));
        return Promise.resolve(null);
    });
    mockOrderRepository.updateById.mockImplementation((orderId, order) => {
        if (orderId === 2) return Promise.resolve(new Order(2, order.customer, order.games.map(game => ({ ...game, price: 100000 })), order.completed));
        return Promise.resolve(null);
    });
    mockOrderRepository.createWithId.mockImplementation((orderId, order) => {
        return Promise.resolve(new Order(orderId, order.customer, order.games.map(game => ({ ...game, price: 100000 })), false));
    });
    mockOrderRepository.deleteById.mockResolvedValue(null);
    mockOrderRepository.completeById.mockResolvedValue(null);

    const mockGameRepository = new MysqlGameRepository(mockMysqlConnection) as jest.Mocked<MysqlGameRepository>;
    mockGameRepository.findByArrayOfIds.mockResolvedValue([new Game(
        1,
        'game',
        1,
        100000,
        'imageUrl',
    )]);
    mockGameRepository.updateByArray.mockResolvedValue(undefined);

    beforeEach(() => {
        orderManager = new OrderManager(mockOrderRepository, mockGameRepository);
    });

    describe('findAllOrders', () => {
        test('should return a order array', async () => {
            const result = await orderManager.findOrders();
            expect(result).toBeInstanceOf(Array);
            expect(result?.every((order) => order instanceof Order)).toBe(true);
        });
    });

    describe('createOrder', () => {
        test('should return a order if the order information is correct', async () => {
            const order = {
                customer: {
                    firstName: 'john',
                    lastName: 'doe',
                    email: 'example@email.com',
                    phone: 1234567890,
                },
                games: [
                    {
                        id: 1,
                        quantity: 1,
                    }
                ],
            };
            const createdOrder = await orderManager.createOrder(order as any);
            expect(createdOrder).toBeInstanceOf(Order);
            expect(createdOrder?.id).toBe(2);
            expect(createdOrder?.customer).toStrictEqual(order.customer);
            expect(createdOrder?.games).toBeInstanceOf(Array);
            expect(createdOrder?.games.every(game => game.id && game.price && game.quantity)).toBe(true);
            expect(createdOrder?.completed).toBe(false);
            expect(createdOrder).toHaveProperty('totalAmount');
        });
    });

    describe('findOrderById', () => {
        test('should return the order when a order with that id exists', async () => {
            const existingOrderId = 1;
            const existingOrder = await orderManager.findOrderById(existingOrderId);
            expect(existingOrder).toBeInstanceOf(Order);
            expect(existingOrder?.id).toBe(existingOrderId);

        });

        test('should return null when the order does not exist', async () => {
            const nonExistingOrderId = 10;
            expect(await orderManager.findOrderById(nonExistingOrderId)).toBeNull();
        });
    });

    describe('updateOrderById', () => {
        test('should return the order modified when a order with that id exists', async () => {
            const order = {
                customer: {
                    firstName: 'john',
                    lastName: 'doe',
                    email: 'example@email.com',
                    phone: 1234567890,
                },
                games: [
                    {
                        id: 1,
                        quantity: 1,
                    }
                ],
            };
            const existingOrderId = 2;
            const updatedOrder = await orderManager.updateOrderById(existingOrderId, order as any);
            expect(updatedOrder).toBeInstanceOf(Order);
            expect(updatedOrder?.id).toBe(existingOrderId);
            expect(updatedOrder?.customer).toStrictEqual(order.customer);
            expect(updatedOrder?.games).toBeInstanceOf(Array);
            expect(updatedOrder?.games.every(game => game.id && game.price && game.quantity)).toBe(true);
            expect(updatedOrder?.completed).toBe(false);
            expect(updatedOrder).toHaveProperty('totalAmount');
        });

        test('should return null when the order does not exist', async () => {
            const order = {
                customer: {
                    firstName: 'john',
                    lastName: 'doe',
                    email: 'example@email.com',
                    phone: 1234567890,
                },
                games: [
                    {
                        id: 1,
                        quantity: 1,
                    }
                ],
            };
            const nonExistingOrderId = 10;
            expect(await orderManager.updateOrderById(nonExistingOrderId, order as any)).toBeNull();
        });
    });

    describe('createOrderWithId', () => {
        test('should return the order created when a order with the given id', async () => {
            const order = {
                customer: {
                    firstName: 'john',
                    lastName: 'doe',
                    email: 'example@email.com',
                    phone: 1234567890,
                },
                games: [
                    {
                        id: 1,
                        quantity: 1,
                    }
                ],
            };
            const orderId = 2;
            const createdOrder = await orderManager.createOrderWithId(orderId, order as any);
            expect(createdOrder).toBeInstanceOf(Order);
            expect(createdOrder?.id).toBe(orderId);
            expect(createdOrder?.customer).toStrictEqual(order.customer);
            expect(createdOrder?.games).toBeInstanceOf(Array);
            expect(createdOrder?.games.every(game => game.id && game.price && game.quantity)).toBe(true);
            expect(createdOrder?.completed).toBe(false);
            expect(createdOrder).toHaveProperty('totalAmount');
        });
    });

    describe('deleteOrderById', () => {
        test('should return null', async () => {
            const orderId = 1;
            expect(await orderManager.deleteOrderById(orderId)).toBeNull();
        });
    });

    describe('completeOrderById', () => {

        const spyOrderCanBeCompleted = jest.spyOn(Order, 'canBeCompleted');
        spyOrderCanBeCompleted
            .mockReturnValueOnce(true)
            .mockImplementationOnce(() => {
                throw new Error('');
            });

        test('should return null if the order can be paid', async () => {
            const orderId = 1;
            expect(await orderManager.completeOrderById(orderId)).toBeNull();
        });

        test('should Throw an exception if the order cannot be paid', async () => {
            const orderId = 1;
            expect(async () => await orderManager.completeOrderById(orderId)).rejects.toThrow();
        });
    });
});