import { UserEntity } from "src/users/entities/user.entity";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import * as dotenv from 'dotenv';
import { BookEntity } from "src/book/entities/book.entity";
import { PurchaseEntity } from "src/purchase/entities/purchase.entity";
import { UserSearchHistory } from "src/history/entities/user-search-history.entity";
dotenv.config();

export const databaseConnection: PostgresConnectionOptions = {
    username: process.env.DB_USERNAME as string,
    password: process.env.DB_PASSWORD as string,
    host: process.env.DB_HOST as string,
    port: parseInt(process.env.DB_PORT as string),
    database: process.env.DB_DATABASE_NAME as string,
    type: "postgres",
    entities: [UserEntity, BookEntity, PurchaseEntity, UserSearchHistory],
    synchronize: false,
    logging: ["error"]
}