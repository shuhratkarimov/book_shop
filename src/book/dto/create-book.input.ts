import { InputType, Int, Field } from "@nestjs/graphql";

@InputType()
export class CreateBookInput {
  @Field()
  title: string;

  @Field()
  author: string;

  @Field()
  price: number;

  @Field()
  genre: string;

  @Field({nullable: true})
  rating?: number;

  @Field({nullable: true})
  soldCopies?: number;
}
