import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseService } from './purchase.service';
import { PurchaseResolver } from './purchase.resolver';
import { PurchaseEntity } from './entities/purchase.entity';
import { BookEntity } from '../book/entities/book.entity';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PurchaseEntity, BookEntity, UserEntity, UsersService])
  ],
  providers: [PurchaseService, PurchaseResolver, UsersService],
  exports: [PurchaseService],
})
export class PurchaseModule {}
