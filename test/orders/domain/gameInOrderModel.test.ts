import { GameInOrder } from '../../../src/orders/domain/gameInOrderModel';

describe('GameInOrderModel', () => {
    test('should create a new game instance', () => {
        const game = new GameInOrder(1, 100000, 1);

        expect(game.id).toBe(1);
        expect(game.price).toBe(100000);
        expect(game.quantity).toBe(1);
    });

    test('should throw an exception if the ID is not a number', () => {
        expect(() => new GameInOrder('1' as any, 100000, 1)).toThrow();
    });

    test('should throw an exception if the quantity is not a number', () => {
        expect(() => new GameInOrder(1, 100000, '1' as any)).toThrow();
    });

    test('should throw an exception if the quantity is less or equal to 0', () => {
        expect(() => new GameInOrder(1, 100000, 0)).toThrow();
        expect(() => new GameInOrder(1, 100000, -1)).toThrow();
    });

    test('should throw an exception if the price is not a number', () => {
        expect(() => new GameInOrder(1, '100000' as any, 1)).toThrow();
    });
});