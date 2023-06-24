import { Game } from '../../../src/games/domain/gameModel';
import { GameManager } from '../../../src/games/application/gameManager';
import MysqlConnection from '../../../src/shared/infrastructure/mysqlConnection';
import { MysqlGameRepository } from '../../../src/games/infrastructure/mysqlRepository/mysqlGameRepository';

jest.mock('../../../src/shared/infrastructure/mysqlConnection');
jest.mock('../../../src/games/infrastructure/mysqlRepository/mysqlGameRepository');

describe('GameManager', () => {
    let gameManager: GameManager;

    const mockMysqlConnection = MysqlConnection.getInstance() as jest.Mocked<MysqlConnection>;
    const mockGameRepository = new MysqlGameRepository(mockMysqlConnection) as jest.Mocked<MysqlGameRepository>;

    mockGameRepository.findAll.mockResolvedValue([new Game(1, 'game', 100, 300000, 'imageUrl')]);
    mockGameRepository.create.mockResolvedValue(new Game(2, 'game', 100, 300000, 'imageUrl'));
    mockGameRepository.findById.mockImplementation((gameId) => {
        if (gameId === 1) return Promise.resolve(new Game(1, 'game', 100, 300000, 'imageUrl'));
        return Promise.resolve(null);
    });
    mockGameRepository.updateById.mockImplementation((gameId, game) => {
        if (gameId === 2) return Promise.resolve(new Game(2, game.name, game.stock, game.price, game.imageUrl));
        return Promise.resolve(null);
    });
    mockGameRepository.createWithId.mockImplementation((gameId, game) => {
        return Promise.resolve(new Game(gameId, game.name, game.stock, game.price, game.imageUrl));
    });
    mockGameRepository.deleteById.mockResolvedValue(null);

    beforeEach(() => {
        gameManager = new GameManager(mockGameRepository);
    });

    describe('findAllGames', () => {
        test('should return a game array', async () => {
            const result = await gameManager.findGames();
            expect(result).toBeInstanceOf(Array);
            expect(result?.every((game) => game instanceof Game)).toBe(true);
        });
    });

    describe('createGame', () => {
        test('should return a game if the game information is correct', async () => {
            const game = {
                name: 'game',
                stock: 100,
                price: 300000,
                imageUrl: 'imageUrl'
            };
            const createdGame = await gameManager.createGame(game);
            expect(createdGame).toBeInstanceOf(Game);
            expect(createdGame?.id).toBe(2);
            expect(createdGame?.name).toBe(game.name);
            expect(createdGame?.stock).toBe(game.stock);
            expect(createdGame?.price).toBe(game.price);
            expect(createdGame?.imageUrl).toBe(game.imageUrl);
        });
    });

    describe('findGameById', () => {
        test('should return the game when a game with that id exists', async () => {
            const existingGameId = 1;
            const existingGame = await gameManager.findGameById(existingGameId);
            expect(existingGame).toBeInstanceOf(Game);
            expect(existingGame?.id).toBe(existingGameId);

        });

        test('should return null when the game does not exist', async () => {
            const nonExistingGameId = 10;
            expect(await gameManager.findGameById(nonExistingGameId)).toBeNull();
        });
    });

    describe('updateGameById', () => {
        test('should return the game modified when a game with that id exists', async () => {
            const game = {
                name: 'game',
                stock: 100,
                price: 300000,
                imageUrl: 'imageUrl'
            };
            const existingGameId = 2;
            const updatedGame = await gameManager.updateGameById(existingGameId, game);
            expect(updatedGame).toBeInstanceOf(Game);
            expect(updatedGame?.id).toBe(existingGameId);
            expect(updatedGame?.name).toBe(game.name);
            expect(updatedGame?.stock).toBe(game.stock);
            expect(updatedGame?.price).toBe(game.price);
            expect(updatedGame?.imageUrl).toBe(game.imageUrl);
        });

        test('should return null when the game does not exist', async () => {
            const game = {
                name: 'game',
                stock: 100,
                price: 300000,
                imageUrl: 'imageUrl'
            };
            const nonExistingGameId = 10;
            expect(await gameManager.updateGameById(nonExistingGameId, game)).toBeNull();
        });
    });

    describe('createGameWithId', () => {
        test('should return the game created when a game with the given id', async () => {
            const game = {
                name: 'game',
                stock: 100,
                price: 300000,
                imageUrl: 'imageUrl'
            };
            const gameId = 2;
            const createdGame = await gameManager.createGameWithId(gameId, game);
            expect(createdGame).toBeInstanceOf(Game);
            expect(createdGame?.id).toBe(gameId);
            expect(createdGame?.name).toBe(game.name);
            expect(createdGame?.stock).toBe(game.stock);
            expect(createdGame?.price).toBe(game.price);
            expect(createdGame?.imageUrl).toBe(game.imageUrl);
        });
    });

    describe('deleteById', () => {
        test('should return null', async () => {
            const gameId = 1;
            expect(await gameManager.deleteGameById(gameId)).toBeNull();
        });
    });
});