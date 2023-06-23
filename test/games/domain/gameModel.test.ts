import { Game } from '../../../src/games/domain/gameModel';

describe('GameModel', () => {
    test('should create a new game instance', () => {
        const game = new Game(1, 'game', 100, 300000, 'imageUrl');

        expect(game.id).toBe(1);
        expect(game.name).toBe('game');
        expect(game.stock).toBe(100);
        expect(game.price).toBe(300000);
        expect(game.imageUrl).toBe('imageUrl');

    });

    test('should throw an exception if the ID is not a number', () => {
        expect(() => new Game('1' as any, 'game', 100, 300000, 'imageUrl')).toThrow();
    });

    test('should throw an exception if the name is not a string', () => {
        expect(() => new Game(1, 123 as any, 100, 300000, 'imageUrl')).toThrow();
    });

    test('should throw an exception if the stock is not a number', () => {
        expect(() => new Game(1, 'game', '100' as any, 300000, 'imageUrl')).toThrow();
    });

    test('should throw an exception if the price is not a number', () => {
        expect(() => new Game(1, 'game', 100, '300000' as any, 'imageUrl')).toThrow();
    });

    test('should throw an exception if the image url is not a string', () => {
        expect(() => new Game(1, 'game', 100, 300000, 123 as any)).toThrow();
    });
});