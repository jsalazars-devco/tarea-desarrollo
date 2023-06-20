import { createConnection, Connection, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE } from '../../../config';
import ErrorWithStatus from '../domain/errorWithStatus';

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

    public async close(): Promise<void> {
        if (this.connection) {
            await this.connection.end();
        }
    }

    public async execute(query: string, values: any[]): Promise<RowDataPacket[] | ResultSetHeader> {
        try {
            await this.connect();
            const [data,] = await this.connection.execute<RowDataPacket[] | ResultSetHeader>(query, values);
            return data;
        } catch (error: any) {
            if (error.status < 500) {
                const err = error;
                throw err;
            }
            if (error.code === 'ER_DUP_ENTRY') {
                const [, duplicatedEntry, , keyValue] = error.sqlMessage.split("'");
                const [, value] = keyValue.split('.');
                const err = new ErrorWithStatus(`The ${value} "${duplicatedEntry}" is already being used`);
                err.status = 403;
                throw err;
            }
            if (error.code === 'ER_NO_REFERENCED_ROW_2') {
                const err = new ErrorWithStatus('Invalid game ID');
                err.status = 403;
                throw err;
            }
            console.error('Error executing query:', error);
            const err = new ErrorWithStatus('Error in database');
            err.status = 500;
            throw err;
        } finally {
            await this.close();
        }
    }
}

export default MysqlDatabaseConnection;
