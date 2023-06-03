import MysqlDatabaseConnection from "../../../shared/infrastructure/mysqlConnection";
import { Game } from "../../domain/gameModel";
import { GameRequest } from "../../domain/gameRequestModel";
import { GameRepository } from "../../domain/gameRepository";
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { CREATE, CREATE_WITH_ID, FIND_ALL, FIND_BY_ID, FIND_BY_NAME, UPDATE_BY_ID } from "./querys";
import ErrorWithStatus from "../../../shared/domain/errorWithStatus";

export class MysqlGameRepository implements GameRepository {

    private connectToMysql: MysqlDatabaseConnection["connect"];
    private closeConnectionToMysql: MysqlDatabaseConnection["close"];
    private getMysqlConnection: MysqlDatabaseConnection["getConnection"];;

    constructor(
        private readonly mysqlDatabaseConnection: MysqlDatabaseConnection
    ) {
        this.connectToMysql = this.mysqlDatabaseConnection.connect.bind(this.mysqlDatabaseConnection);
        this.closeConnectionToMysql = this.mysqlDatabaseConnection.close.bind(this.mysqlDatabaseConnection);
        this.getMysqlConnection = this.mysqlDatabaseConnection.getConnection.bind(this.mysqlDatabaseConnection);
    }

    async findAll(): Promise<Game[] | null> {

        await this.connectToMysql();
        const connection = this.getMysqlConnection();

        try {
            const [gameRows,] = await connection.execute<RowDataPacket[]>(FIND_ALL);

            const games = gameRows.map((game: RowDataPacket) => new Game(
                game.id,
                game.name,
                game.stock,
                game.price,
                game.imageUrl,
            ));

            return games;

        } catch (error) {
            console.error('Error executing query:', error);
            const err = new ErrorWithStatus('Error in database');
            err.status = 500;
            throw err;
        } finally {
            await this.closeConnectionToMysql();
        }
    }

    async create(game: GameRequest): Promise<Game | null> {

        await this.connectToMysql();
        const connection = this.getMysqlConnection();

        try {
            const gameRequest = new GameRequest(
                game.name,
                game.stock,
                game.price,
                game.imageUrl,
            );

            const [data,] = await connection.execute<RowDataPacket[]>(FIND_BY_NAME, [gameRequest.name]);
            if (data.length > 0) {
                if (
                    data[0].name !== gameRequest.name
                    || data[0].stock !== gameRequest.stock
                    || data[0].price !== gameRequest.price
                    || data[0].imageUrl !== gameRequest.imageUrl
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

            const values = Object.values(gameRequest).filter(value => value !== undefined);
            const [result,] = await connection.execute<ResultSetHeader>(CREATE, values);

            const [gameRow,] = await connection.execute<RowDataPacket[]>(FIND_BY_ID, [result.insertId]);

            const newGame = new Game(
                gameRow[0].id,
                gameRow[0].name,
                gameRow[0].stock,
                gameRow[0].price,
                gameRow[0].imageUrl,
            );

            return newGame;

        } catch (error: any) {
            throw error;
        } finally {
            await this.closeConnectionToMysql();
        }
    }

    async findById(gameId: number): Promise<Game | null> {

        await this.connectToMysql();
        const connection = this.getMysqlConnection();

        try {
            const [gameRow,] = await connection.execute<RowDataPacket[]>(FIND_BY_ID, [gameId]);

            if (gameRow.length > 0) {
                const game = new Game(
                    gameRow[0].id,
                    gameRow[0].name,
                    gameRow[0].stock,
                    gameRow[0].price,
                    gameRow[0].imageUrl,
                );

                return game;
            }

            const error = new ErrorWithStatus('Invalid ID');
            error.status = 404;
            throw error;

        } catch (error: any) {
            if (error.status === 403) {
                const err = error;
                throw err;
            }
            console.error('Error executing query:', error);
            const err = new ErrorWithStatus('Error in database');
            err.status = 500;
            throw err;
        } finally {
            await this.closeConnectionToMysql();
        }
    }

    async updateById(gameId: number, game: GameRequest): Promise<[Game, number] | null> {
        await this.connectToMysql();
        const connection = this.getMysqlConnection();

        try {
            const [gameRow, _] = await connection.execute<RowDataPacket[]>(FIND_BY_ID, [gameId]);

            if (gameRow.length > 0) {
                const values = Object.values(new GameRequest(
                    game.name,
                    game.stock,
                    game.price,
                    game.imageUrl,
                ));

                values.push(gameId);

                const [,] = await connection.execute<ResultSetHeader>(UPDATE_BY_ID, values);
                const [data,] = await connection.execute<RowDataPacket[]>(FIND_BY_ID, [gameId]);

                const updatedGame = new Game(
                    data[0].id,
                    data[0].name,
                    data[0].stock,
                    data[0].price,
                    data[0].imageUrl,
                );

                return [updatedGame, 200];
            }
            else {
                const newData = new Game(
                    gameId,
                    game.name,
                    game.stock,
                    game.price,
                    game.imageUrl,
                );

                const values = Object.values(newData);

                const [,] = await connection.execute<ResultSetHeader>(CREATE_WITH_ID, values);
                const [data,] = await connection.execute<RowDataPacket[]>(FIND_BY_ID, [gameId]);

                const createdGame = new Game(
                    data[0].id,
                    data[0].name,
                    data[0].stock,
                    data[0].price,
                    data[0].imageUrl,
                );

                return [createdGame, 201];
            }
        } catch (error: any) {
            if (error.status === 403) {
                const err = error;
                throw err;
            }
            console.error('Error executing query:', error);
            const err = new ErrorWithStatus('Error in database');
            err.status = 500;
            throw err;
        } finally {
            await this.closeConnectionToMysql();
        }
    }
}