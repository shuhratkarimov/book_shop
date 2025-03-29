import { InputType, Field } from "@nestjs/graphql";
import { IsEmail, IsNegative, IsNumber, IsString } from "class-validator";

@InputType()
export class VerifyForgotPasswordDto  {
  @Field()
  @IsString()
  @IsEmail({}, { message: "Enter a valid email" })
  email: string;

  @Field()
  @IsNumber()
  code: number;

  @Field()
  @IsString()
  newPassword: string;
}