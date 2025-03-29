import { ObjectType, Field, Int, Float } from "@nestjs/graphql";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PurchaseEntity } from "../../purchase/entities/purchase.entity";

@ObjectType()
@Entity()
export class BookEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  genre: string;

  @Field()
  @Column()
  author: string;

  @Field(() => Float, {nullable: true})
  @Column({ type: "float", default: 0 })
  rating: number;

  @Field(() => Int, {nullable: true})
  @Column({ default: 0 })
  soldCopies: number;
  
  @Field(() => Float)
  @Column()
  price: number;

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @OneToMany(() => PurchaseEntity, (purchase) => purchase.book, { cascade: true })
  purchases: PurchaseEntity[];
}
