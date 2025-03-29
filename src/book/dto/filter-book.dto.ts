import { Field, Float, InputType, Int } from "@nestjs/graphql";

@InputType()
export class FilterBookInput {
  @Field({ nullable: true })
  title?: string;

  @Field(() => Float, { nullable: true })
  minPrice?: number;

  @Field(() => Float, { nullable: true })
  maxPrice?: number;

  @Field({ nullable: true })
  genre?: string;

  @Field(() => Int, { nullable: true })
  excludeBookId?: number;

  @Field({ nullable: true })
  sortBy?: string;

  @Field({ nullable: true })
  order?: "ASC" | "DESC";

  @Field(() => Int, { nullable: true })
  limit?: number;
}
