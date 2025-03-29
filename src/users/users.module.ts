import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { PurchaseModule } from 'src/purchase/purchase.module';
import { PurchaseEntity } from 'src/purchase/entities/purchase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, PurchaseEntity]), PurchaseModule],
  providers: [UsersResolver, UsersService],
  exports: [UsersService]
})
export class UsersModule {}
