import { InputType, Field } from "@nestjs/graphql";
import { IsEmail, IsString } from "class-validator";

@InputType()
export class ForgorPasswordDto {
  @Field()
  @IsString()
  @IsEmail({}, { message: "Enter a valid email" })
  email: string;
}
