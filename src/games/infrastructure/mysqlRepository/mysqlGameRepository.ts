import MysqlDatabaseConnection from "../../../shared/infrastructure/mysqlConnection";
import { Game } from "../../domain/gameModel";
import { GameRepository } from "../../domain/gameRepository";
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { CREATE, FIND, FIND_BY_ID, FIND_BY_NAME } from "./querys";
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

    async find(): Promise<Game[] | null> {

        await this.connectToMysql();
        const connection = this.getMysqlConnection();

        try {
            const query = FIND;
            const [gameRows, _] = await connection.execute<RowDataPacket[]>(query);

            const games = gameRows.map((game: RowDataPacket) => new Game(
                game.name,
                game.stock,
                game.price,
                game.imageUrl,
                game.id,
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

    async findById(gameId: string): Promise<Game | null> {

        await this.connectToMysql();
        const connection = this.getMysqlConnection();

        try {
            const query = FIND_BY_ID;
            const [gameRow, _] = await connection.execute<RowDataPacket[]>(query, [gameId]);

            if (gameRow.length > 0) {
                const game = new Game(
                    gameRow[0].name,
                    gameRow[0].stock,
                    gameRow[0].price,
                    gameRow[0].imageUrl,
                    gameRow[0].id,
                );

                return game;
            }

            const error = new ErrorWithStatus('Invalid ID');
            error.status = 404;
            throw error;

        } catch (error: any) {
            if (error.status === 404) {
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

    async create(game: Game): Promise<Game | null> {

        await this.connectToMysql();
        const connection = this.getMysqlConnection();

        try {
            const verifiedGame = new Game(
                game.name,
                game.stock,
                game.price,
                game.imageUrl,
            );

            const queryFindByName = FIND_BY_NAME;
            const [data, ___] = await connection.execute<RowDataPacket[]>(queryFindByName, [verifiedGame.name]);
            if (data.length > 0) {
                const gameAlreadyOnDb = new Game(
                    data[0].name,
                    data[0].stock,
                    data[0].price,
                    data[0].imageUrl,
                    data[0].id,
                );

                return gameAlreadyOnDb;
            }

            const queryCreate = CREATE;
            const values = Object.values(verifiedGame).filter(value => value !== undefined);
            const [result, __] = await connection.execute<ResultSetHeader>(queryCreate, values);

            const queryFindById = FIND_BY_ID;
            const [gameRow, _] = await connection.execute<RowDataPacket[]>(queryFindById, [result.insertId]);

            const newGame = new Game(
                gameRow[0].name,
                gameRow[0].stock,
                gameRow[0].price,
                gameRow[0].imageUrl,
                gameRow[0].id,
            );

            return newGame;

        } catch (error: any) {
            throw error;
        } finally {
            await this.closeConnectionToMysql();
        }
    }
}