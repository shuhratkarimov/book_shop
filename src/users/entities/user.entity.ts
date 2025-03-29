import { Field, Int, ObjectType, HideField } from '@nestjs/graphql';
import { PurchaseEntity } from '../../purchase/entities/purchase.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';

@ObjectType()
@Entity()
export class UserEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  username: string;

  @Field()
  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  email: string;

  @HideField()
  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Field()
  @Column({ type: 'varchar', default: 'user', nullable: false })
  role: string;

  @Field()
  @Column({ type: 'boolean', default: false, nullable: false })
  isVerified: boolean;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true, default: 0 })
  verificationCode?: number;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: false, default: 0 })
  attempts: number;

  @Field()
  @CreateDateColumn()
  allowedTime: Date;

  @Field(() => Int, { nullable: true })
  @Column({ type: 'int', nullable: true, default: 0 })
  passwordRecoverCode: number;

  @HideField()
  @CreateDateColumn()
  timestamp: Date;

  @Field(() => [PurchaseEntity], { nullable: true }) 
  @OneToMany(() => PurchaseEntity, (purchase) => purchase.user)
  purchases: PurchaseEntity[];
}
