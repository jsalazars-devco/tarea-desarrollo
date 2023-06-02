import MysqlDatabaseConnection from "../../../shared/infrastructure/mysqlConnection";
import { Game } from "../../domain/gameModel";
import { GameRepository } from "../../domain/gameRepository";
import { RowDataPacket } from 'mysql2/promise';
import { FIND, FIND_BY_ID } from "./querys";

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
            if (!Array.isArray(gameRows)) {
                const err: any = new Error('Error in database');
                err.status = 500;
                throw err;
            }

            const games = gameRows.map((game: RowDataPacket) => new Game(
                game.id,
                game.name,
                game.stock,
                game.price,
                game.consolesIds ? game.consolesIds.split(',') : [],
                game.categoriesIds ? game.categoriesIds.split(',') : [],
                game.imageUrl
            ));

            return games;

        } catch (error) {
            console.error('Error executing query:', error);
            const err: any = new Error('Error in database');
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

            const game = new Game(
                gameRow[0].id,
                gameRow[0].name,
                gameRow[0].stock,
                gameRow[0].price,
                gameRow[0].consolesIds ? gameRow[0].consolesIds.split(',') : [],
                gameRow[0].categoriesIds ? gameRow[0].categoriesIds.split(',') : [],
                gameRow[0].imageUrl
            );

            return game;

        } catch (error) {
            console.error('Error executing query:', error);
            const err: any = new Error('Error in database');
            err.status = 500;
            throw err;
        } finally {
            await this.closeConnectionToMysql();
        }
    }
}