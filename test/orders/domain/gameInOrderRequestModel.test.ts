import { GameInOrderRequest } from '../../../src/orders/domain/gameInOrderRequestModel';

describe('GameInOrderRequestModel', () => {
    test('should create a new game instance', () => {
        const game = new GameInOrderRequest(1, 1);

        expect(game.id).toBe(1);
        expect(game.quantity).toBe(1);
    });

    test('should throw an exception if the ID is not a number', () => {
        expect(() => new GameInOrderRequest('1' as any, 1)).toThrow();
    });

    test('should throw an exception if the quantity is not a number', () => {
        expect(() => new GameInOrderRequest(1, '1' as any)).toThrow();
    });

    test('should throw an exception if the quantity is less or equal to 0', () => {
        expect(() => new GameInOrderRequest(1, 0)).toThrow();
        expect(() => new GameInOrderRequest(1, -1)).toThrow();
    });
});