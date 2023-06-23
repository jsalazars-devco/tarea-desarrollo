import MysqlDatabaseConnection from '../../../../src/shared/infrastructure/mysqlConnection';
import { Game } from '../../../../src/games/domain/gameModel';
import { MysqlGameRepository } from '../../../../src/games/infrastructure/mysqlRepository/mysqlGameRepository';
import * as QUERIES from '../../../../src/games/infrastructure/mysqlRepository/queries';
import { GameRequest } from '../../../../src/games/domain/gameRequestModel';

describe('MysqlGameRepository', () => {

    const mockMysqlConnection = MysqlDatabaseConnection.getInstance();
    const spyMysqlConnectionExecute = jest.spyOn(mockMysqlConnection, 'execute');

    spyMysqlConnectionExecute.mockImplementation((query, values): any => {
        if (query === QUERIES.FIND_ALL) {
            return Promise.resolve([
                {
                    id: 1,
                    name: 'game1',
                    stock: 100,
                    price: 100000,
                    imageUrl: 'imageUrl1'
                }
            ]);
        }
        else if (query === QUERIES.FIND_BY_ID) {
            const id = values[0];
            if (id === 1) {
                return Promise.resolve([{
                    id: id,
                    name: 'game1',
                    stock: 100,
                    price: 100000,
                    imageUrl: 'imageUrl1'
                }]);
            }
            else if (id === 2) {
                return Promise.resolve([{
                    id: id,
                    name: 'game2',
                    stock: 200,
                    price: 200000,
                    imageUrl: 'imageUrl2'
                }]);

            }
            return Promise.resolve([]);
        }
        else if (query === QUERIES.FIND_GAMES_BY_ID + '(1,2)') {
            return Promise.resolve([
                {
                    id: 1,
                    name: 'game1',
                    stock: 100,
                    price: 100000,
                    imageUrl: 'imageUrl1'
                },
                {
                    id: 2,
                    name: 'game2',
                    stock: 200,
                    price: 200000,
                    imageUrl: 'imageUrl2'
                }
            ]);
        }
        else if (query === QUERIES.FIND_BY_NAME) {
            const name = values[0];
            if (name === 'game1') {
                return Promise.resolve([{
                    id: 1,
                    name: 'game1',
                    stock: 100,
                    price: 100000,
                    imageUrl: 'imageUrl1'
                }]);
            }
            else {
                return Promise.resolve([]);
            }
        }
        else if (query === QUERIES.CREATE || query === QUERIES.CREATE_WITH_ID || query === QUERIES.UPDATE_BY_ID || query === QUERIES.DELETE_BY_ID) {
            return Promise.resolve({
                insertId: 2,
            });
        }
    });

    let mysqlGameRepository: MysqlGameRepository;
    beforeEach(() => {
        mysqlGameRepository = new MysqlGameRepository(mockMysqlConnection);
    });

    describe('findAll', () => {
        test('should return a game array', async () => {
            const result = await mysqlGameRepository.findAll();
            expect(result).toBeInstanceOf(Array);
            expect(result?.every((game) => game instanceof Game)).toBe(true);
        });
    });

    describe('create', () => {
        test('should return the new created game if the gamename is not on the database', async () => {
            const game = new GameRequest('game2', 200, 200000, 'imageUrl2');
            const result = await mysqlGameRepository.create(game);
            expect(result).toBeInstanceOf(Game);
            expect(result?.id).toBe(2);
            expect(result?.name).toBe(game.name);
            expect(result?.stock).toBe(game.stock);
            expect(result?.price).toBe(game.price);
            expect(result?.imageUrl).toBe(game.imageUrl);
        });

        test('should return the same game if the game is exactly the same in the database', async () => {
            const game = new GameRequest('game1', 100, 100000, 'imageUrl1');
            const result = await mysqlGameRepository.create(game);
            expect(result).toBeInstanceOf(Game);
            expect(result?.id).toBe(1);
            expect(result?.name).toBe(game.name);
            expect(result?.stock).toBe(game.stock);
            expect(result?.price).toBe(game.price);
            expect(result?.imageUrl).toBe(game.imageUrl);
        });

        test('should throw an exception if the game is already in the database but is not exactly the same', () => {
            const game = new GameRequest('game1', 300, 100000, 'imageUrl1');
            expect(async () => await mysqlGameRepository.create(game)).rejects.toThrow();

            const game2 = new GameRequest('game1', 100, 300000, 'imageUrl1');
            expect(async () => await mysqlGameRepository.create(game2)).rejects.toThrow();

            const game3 = new GameRequest('game1', 100, 100000, 'imageUrl3');
            expect(async () => await mysqlGameRepository.create(game3)).rejects.toThrow();
        });
    });

    describe('findById', () => {
        test('should return the game if the ID is on the database', async () => {
            const existingGameId = 1;
            const existingGame = await mysqlGameRepository.findById(existingGameId);
            expect(existingGame).toBeInstanceOf(Game);
            expect(existingGame?.id).toBe(existingGameId);
        });

        test('should throw an exception if the ID is not on the database', async () => {
            const nonExistingGameId = 3;
            expect(async () => await mysqlGameRepository.findById(nonExistingGameId)).rejects.toThrow();
        });
    });

    describe('findByArrayOfIds', () => {
        test('should return a game array with games with the specified IDs', async () => {
            const existingGameIds = [1, 2];
            const existingGames = await mysqlGameRepository.findByArrayOfIds(existingGameIds);
            expect(existingGames).toBeInstanceOf(Array);
            expect(existingGames?.every(game => game instanceof Game)).toBe(true);
            expect(existingGames?.every(game => existingGameIds.includes(game.id))).toBe(true);
        });
    });

    describe('updateById', () => {
        test('should return the updated game if the ID is on the database', async () => {
            const existingGameId = 1;
            const game = new GameRequest('game1', 100, 100000, 'imageUrl1');
            const result = await mysqlGameRepository.updateById(existingGameId, game);
            expect(result).toBeInstanceOf(Game);
            expect(result?.id).toBe(existingGameId);
            expect(result?.name).toBe(game.name);
            expect(result?.stock).toBe(game.stock);
            expect(result?.price).toBe(game.price);
            expect(result?.imageUrl).toBe(game.imageUrl);
        });

        test('should return null if the ID is not on the database', async () => {
            const nonExistingGameId = 3;
            const values = new GameRequest('game1', 100, 100000, 'imageUrl1');
            expect(await mysqlGameRepository.updateById(nonExistingGameId, values)).toBeNull();
        });
    });

    describe('createWithId', () => {
        test('should return the created game with the specified ID', async () => {
            const newGameId = 2;
            const game = new GameRequest('game2', 200, 200000, 'imageUrl2');

            const result = await mysqlGameRepository.createWithId(newGameId, game);
            expect(result).toBeInstanceOf(Game);
            expect(result?.id).toBe(newGameId);
            expect(result?.name).toBe(game.name);
            expect(result?.stock).toBe(game.stock);
            expect(result?.price).toBe(game.price);
            expect(result?.imageUrl).toBe(game.imageUrl);
        });
    });

    describe('deleteById', () => {
        test('should return null if the ID is on the database', async () => {
            const existingGameId = 2;
            expect(await mysqlGameRepository.deleteById(existingGameId)).toBeNull();
        });

        test('should throw and exception if the ID is not on the database', async () => {
            const nonExistingGameId = 3;
            expect(async () => await mysqlGameRepository.deleteById(nonExistingGameId)).rejects.toThrow();
        });
    });

    describe('updateByArray', () => {
        test('should return undefined because it is a void function', async () => {
            const games = [
                {
                    id: 1,
                    name: 'game1',
                    stock: 100,
                    price: 100000,
                    imageUrl: 'imageUrl1'
                },
                {
                    id: 2,
                    name: 'game2',
                    stock: 200,
                    price: 200000,
                    imageUrl: 'imageUrl2'
                }
            ];
            expect(await mysqlGameRepository.updateByArray(games)).toBe(undefined);
        });
    });
});