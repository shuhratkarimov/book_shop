import { InputType, Field } from "@nestjs/graphql";
import { IsEmail, IsString } from "class-validator";

@InputType()
export class LoginDto {
  @Field()
  @IsString()
  @IsEmail({}, { message: "Enter a valid email" })
  email: string;

  @Field()
  @IsString()
  password: string;
}
