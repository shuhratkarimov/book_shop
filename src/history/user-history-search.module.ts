import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSearchHistory } from './entities/user-search-history.entity';
import { UserSearchHistoryService } from './user-search-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserSearchHistory])],
  providers: [UserSearchHistoryService],
  exports: [UserSearchHistoryService],
})
export class UserSearchHistoryModule {}