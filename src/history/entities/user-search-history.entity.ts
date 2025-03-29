import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { BookEntity } from '../../book/entities/book.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class UserSearchHistory {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  userId: number;

  @Field()
  @ManyToOne(() => BookEntity)
  book: BookEntity;

  @Field()
  @Column()
  searchDate: Date;
}