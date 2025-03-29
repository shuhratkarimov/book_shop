import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { PurchaseService } from './purchase.service';
import { PurchaseEntity } from './entities/purchase.entity';
import { UsersService } from 'src/users/users.service';

@Resolver(() => PurchaseEntity)
export class PurchaseResolver {
  constructor(private readonly purchaseService: PurchaseService, private readonly userService: UsersService) {}

  @Mutation(() => PurchaseEntity, {name: "purchases"})
  async buyBook(
    @Args('userId') userId: number,
    @Args('bookId') bookId: number,
  ): Promise<PurchaseEntity> {
    return this.purchaseService.buyBook(userId, bookId);
  }

  @Query(() => [PurchaseEntity], { nullable: true, name: "getPurchases"})
  async getUserPurchases(@Args('userId') userId: number): Promise<PurchaseEntity[]> {
    return this.userService.getPurchasesByUserId(userId);
  }
}
