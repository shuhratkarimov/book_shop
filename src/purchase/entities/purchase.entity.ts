import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { UserEntity } from "../../users/entities/user.entity";
import { BookEntity } from '../../book/entities/book.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class PurchaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, (user) => user.purchases)
  user: UserEntity;

  @Field(() => BookEntity)
  @ManyToOne(() => BookEntity, (book) => book.purchases)
  book: BookEntity;

  @Field()
  @CreateDateColumn()
  purchasedAt: Date;
}
