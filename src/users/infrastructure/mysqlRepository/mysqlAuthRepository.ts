import MysqlDatabaseConnection from "../../../shared/infrastructure/mysqlConnection";
// import { User } from "../../domain/users/userModel";
// import { UserResponse } from "../../domain/users/userResponseModel";
// import { UserRepository } from "../../domain/users/userRepository";
// import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
// import { UserDbRequest } from "../../domain/users/userDbRequestModel";
// import { CREATE, CREATE_WITH_ID, DELETE_BY_ID, FIND_ALL, FIND_BY_ID, FIND_BY_USERNAME, UPDATE_BY_ID } from "./querys";
// import ErrorWithStatus from "../../../shared/domain/errorWithStatus";
import { AuthRepository } from "../../domain/auth/authRepository";
import { LoginRequest } from "../../domain/auth/loginRequestModel";
import { LoginResponse } from "../../domain/auth/loginResponseModel";

export class MysqlAuthRepository implements AuthRepository {

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

    async loginUser(login: LoginRequest): Promise<LoginResponse | null> {
        await this.connectToMysql();
        const connection = this.getMysqlConnection();
        connection;
        this.closeConnectionToMysql();

        console.log(login);
        throw new Error("Method not implemented.");
    }

    logoutUser(token: string): Promise<null> {
        token;
        throw new Error("Method not implemented.");
    }

    verifyUser(token: string): Promise<LoginResponse | null> {
        token;
        throw new Error("Method not implemented.");
    }


}