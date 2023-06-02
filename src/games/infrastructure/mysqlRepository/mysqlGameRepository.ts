import { Game } from "../../domain/gameModel";
import { GameRepository } from "../../domain/gameRepository";
import { createConnection, Connection, RowDataPacket } from 'mysql2/promise';

export class MysqlGameRepository implements GameRepository {
    async get(): Promise<Game[] | null> {

        const connection: Connection = await createConnection({
            host: 'localhost',
            user: 'root',
            password: 'mysql1234',
            database: 'tienda_videojuegos'
        });

        try {
            const query = `SELECT
                                games.id,
                                games.name,
                                games.stock,
                                games.price,
                                GROUP_CONCAT(DISTINCT consoles.id) AS consolesIds,
                                GROUP_CONCAT(DISTINCT categories.id) AS categoriesIds,
                                games.imageUrl
                            FROM games
                            LEFT JOIN game_consoles ON games.id = game_consoles.game_id
                            LEFT JOIN consoles ON game_consoles.console_id = consoles.id
                            LEFT JOIN game_categories ON games.id = game_categories.game_id
                            LEFT JOIN categories ON game_categories.category_id = categories.id
                            GROUP BY games.id
                            `;
            const [gameRows, _] = await connection.execute<RowDataPacket[]>(query);
            if (!Array.isArray(gameRows)) {
                const err: any = new Error('Error in database');
                err.status = 500;
                throw err;
            }

            const games = gameRows.map((data: RowDataPacket) => ({
                id: data.id,
                name: data.name,
                stock: data.stock,
                price: data.price,
                consolesIds: data.consolesIds ? data.consolesIds.split(',').map(Number) : [],
                categoriesIds: data.categoriesIds ? data.categoriesIds.split(',').map(Number) : [],
                imageUrl: data.imageUrl
            }));

            if (!games) {
                return null;
            }

            const gamesInRepository = games.map(game => new Game(
                game.id,
                game.name,
                game.stock,
                game.price,
                game.consolesIds,
                game.categoriesIds,
                game.imageUrl
            ));

            return gamesInRepository;

        } catch (error) {
            console.error('Error executing query:', error);
            const err: any = new Error('Error in database');
            err.status = 500;
            throw err;
        } finally {
            await connection.end();
        }
    }
}