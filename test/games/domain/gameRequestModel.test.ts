import { GameRequest } from '../../../src/games/domain/gameRequestModel';

describe('GameRequestModel', () => {
    test('should create a new game request instance', () => {
        const game = new GameRequest('game', 100, 300000, 'imageUrl');

        expect(game.name).toBe('game');
        expect(game.stock).toBe(100);
        expect(game.price).toBe(300000);
        expect(game.imageUrl).toBe('imageUrl');
    });


    test('should throw an exception if the name is not a string', () => {
        expect(() => new GameRequest(123 as any, 100, 300000, 'imageUrl')).toThrow();
    });

    test('should throw an exception if the stock is not a number', () => {
        expect(() => new GameRequest('game', '100' as any, 300000, 'imageUrl')).toThrow();
    });

    test('should throw an exception if the price is not a number', () => {
        expect(() => new GameRequest('game', 100, '300000' as any, 'imageUrl')).toThrow();
    });

    test('should throw an exception if the image url is not a string', () => {
        expect(() => new GameRequest('game', 100, 300000, 123 as any)).toThrow();
    });
});