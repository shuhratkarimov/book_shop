import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { databaseConnection } from "./config/database";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { UsersModule } from "./users/users.module";
import { BookModule } from "./book/book.module";
import { PurchaseModule } from './purchase/purchase.module';
import * as cookieParser from "cookie-parser";
import { UserSearchHistoryModule } from "./history/user-history-search.module";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    TypeOrmModule.forRoot(databaseConnection),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      playground: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    UsersModule,
    BookModule,
    PurchaseModule,
    UserSearchHistoryModule,
    HttpModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieParser()).forRoutes("*");
  }
}
