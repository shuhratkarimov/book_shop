import { Field, InputType } from '@nestjs/graphql';

@InputType() 
export class VerifyDto {
  @Field()
  email: string;

  @Field()
  verificationCode: number;
}
