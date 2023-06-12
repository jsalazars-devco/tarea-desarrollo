import MysqlDatabaseConnection from '../../../shared/infrastructure/mysqlConnection';
import { Game } from '../../domain/gameModel';
import { GameRequest } from '../../domain/gameRequestModel';
import { GameRepository } from '../../domain/gameRepository';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { CREATE, CREATE_WITH_ID, DELETE_BY_ID, FIND_ALL, FIND_BY_ID, FIND_BY_NAME, FIND_GAMES_BY_ID, UPDATE_BY_ID } from './querys';
import ErrorWithStatus from '../../../shared/domain/errorWithStatus';

export class MysqlGameRepository implements GameRepository {

    private executeMysqlQuery: MysqlDatabaseConnection['execute'];

    constructor(
        readonly mysqlDatabaseConnection: MysqlDatabaseConnection
    ) {

        this.executeMysqlQuery = mysqlDatabaseConnection.execute.bind(mysqlDatabaseConnection);
    }

    async findAll(): Promise<Game[] | null> {

        const data = await this.executeMysqlQuery(FIND_ALL, []) as RowDataPacket[];

        const games = data.map((game: RowDataPacket) => new Game(
            game.id,
            game.name,
            game.stock,
            game.price,
            game.imageUrl,
        ));

        return games;
    }

    async create(game: GameRequest): Promise<Game | null> {

        const data = await this.executeMysqlQuery(FIND_BY_NAME, [game.name]) as RowDataPacket[];

        if (data.length > 0) {
            if (
                data[0].name !== game.name
                || data[0].stock !== game.stock
                || data[0].price !== game.price
                || data[0].imageUrl !== game.imageUrl
            ) {
                const error = new ErrorWithStatus('To modify the game, try the PUT /api/game/{gameId} endpoint');
                error.status = 403;
                throw error;
            }
            const gameAlreadyOnDb = new Game(
                data[0].id,
                data[0].name,
                data[0].stock,
                data[0].price,
                data[0].imageUrl,
            );

            return gameAlreadyOnDb;
        }

        const values = Object.values(game);
        const result = await this.executeMysqlQuery(CREATE, values) as ResultSetHeader;
        const gameRow = await this.executeMysqlQuery(FIND_BY_ID, [result.insertId]) as RowDataPacket;

        const newGame = new Game(
            gameRow[0].id,
            gameRow[0].name,
            gameRow[0].stock,
            gameRow[0].price,
            gameRow[0].imageUrl,
        );

        return newGame;
    }

    async findById(gameId: number): Promise<Game | null> {

        const data = await this.executeMysqlQuery(FIND_BY_ID, [gameId]) as RowDataPacket[];

        if (data.length === 0) {
            const error = new ErrorWithStatus('Game not found');
            error.status = 404;
            throw error;
        }

        const game = new Game(
            data[0].id,
            data[0].name,
            data[0].stock,
            data[0].price,
            data[0].imageUrl,
        );

        return game;
    }

    async updateById(gameId: number, game: GameRequest): Promise<Game | null> {

        const gameOnDb = await this.executeMysqlQuery(FIND_BY_ID, [gameId]) as RowDataPacket[];

        if (gameOnDb.length === 0) {
            return null;
        }

        const values = Object.values(game);

        values.push(gameId);

        await this.executeMysqlQuery(UPDATE_BY_ID, values);
        const data = await this.executeMysqlQuery(FIND_BY_ID, [gameId]) as RowDataPacket[];

        const updatedGame = new Game(
            data[0].id,
            data[0].name,
            data[0].stock,
            data[0].price,
            data[0].imageUrl,
        );

        return updatedGame;

    }

    async createWithId(gameId: number, game: GameRequest): Promise<Game | null> {

        const newData = new Game(
            gameId,
            game.name,
            game.stock,
            game.price,
            game.imageUrl,
        );

        const values = Object.values(newData);

        await this.executeMysqlQuery(CREATE_WITH_ID, values) as ResultSetHeader;
        const data = await this.executeMysqlQuery(FIND_BY_ID, [gameId]) as RowDataPacket[];

        const createdGame = new Game(
            data[0].id,
            data[0].name,
            data[0].stock,
            data[0].price,
            data[0].imageUrl,
        );

        return createdGame;

    }

    async deleteById(gameId: number): Promise<null> {

        const data = await this.executeMysqlQuery(FIND_BY_ID, [gameId]) as RowDataPacket[];

        if (data.length === 0) {
            const error = new ErrorWithStatus('Invalid ID');
            error.status = 403;
            throw error;
        }

        await this.executeMysqlQuery(DELETE_BY_ID, [gameId]);
        return null;
    }

    async findByArrayOfIds(gamesIds: number[]): Promise<Game[] | null> {

        const data = await this.executeMysqlQuery(FIND_GAMES_BY_ID + `(${gamesIds.join(',')})`, []) as RowDataPacket[];

        const gamesInOrder = data.map((game: RowDataPacket) => new Game(
            game.id,
            game.name,
            game.stock,
            game.price,
            game.imageUrl,
        ));

        return gamesInOrder;
    }

    async updateByArray(games: Game[]): Promise<void> {

        await Promise.all(games.map(async (game) => {
            const values = Object.values(game);
            values.shift();
            values.push(game.id);
            return await this.executeMysqlQuery(UPDATE_BY_ID, values);
        }));
    }
}