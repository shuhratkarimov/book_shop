import { CreateBookInput } from "./create-book.input";
import { InputType, Field, Int, PartialType } from "@nestjs/graphql";

@InputType()
export class UpdateBookInput extends PartialType(CreateBookInput) {
  @Field({ nullable: true })
  id?: number;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  author?: string;

  @Field({ nullable: true })
  price?: number;

  @Field({ nullable: true })
  genre?: string;

  @Field({ nullable: true })
  createdAt?: Date;
}
