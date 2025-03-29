import { Module } from "@nestjs/common";
import { BookService } from "./book.service";
import { BookResolver } from "./book.resolver";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BookEntity } from "./entities/book.entity";
import { HttpModule } from "@nestjs/axios";
import { UserSearchHistoryModule } from "src/history/user-history-search.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([BookEntity]),
    HttpModule,
    UserSearchHistoryModule,
  ],
  providers: [BookResolver, BookService],
  exports: [TypeOrmModule],
})
export class BookModule {}
