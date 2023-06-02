import { createConnection, Connection } from 'mysql2/promise';
import { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } from '../../../config';

class MysqlDatabaseConnection {
    private static instance: MysqlDatabaseConnection;
    private connection!: Connection;

    private constructor() { }

    public static getInstance(): MysqlDatabaseConnection {
        if (!MysqlDatabaseConnection.instance) {
            MysqlDatabaseConnection.instance = new MysqlDatabaseConnection();
        }
        return MysqlDatabaseConnection.instance;
    }

    public async connect(): Promise<void> {
        try {
            this.connection = await createConnection({
                host: DB_HOST,
                user: DB_USER,
                password: DB_PASSWORD,
                database: DB_DATABASE
            });
        } catch (error) {
            console.error('Error connecting to the database:', error);
        }
    }

    public getConnection(): Connection {
        return this.connection;
    }

    public async close(): Promise<void> {
        if (this.connection) {
            await this.connection.end();
        }
    }
}

export default MysqlDatabaseConnection;
