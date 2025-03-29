import { Resolver, Query, Mutation, Args, Int, Context, ObjectType, Field } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { UserEntity } from "./entities/user.entity";
import { UserInput } from "./dto/user-input.dto";
import { VerifyDto } from "./dto/verify.dto";
import { LoginDto } from "./dto/login-dto";
import { ForgorPasswordDto } from "./dto/forgot_password.dto";
import { VerifyForgotPasswordDto } from "./dto/verify_forgot_password.dto";

@ObjectType()
export class ResponseMessage {
  @Field()
  message: string;
}

@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}
  @Query(() => String)
  hello() {
    return "Hello, GraphQL!";
  }
  
  @Mutation(() => ResponseMessage, { name: "register" })
  async register(@Args("userData") userData: UserInput): Promise <ResponseMessage | any> { 
    try {
      return this.usersService.register(userData);
    } catch (error) {
      console.log(error);
    }
  }

  @Mutation(() => ResponseMessage, { name: "verify" })
  async verify(@Args('verifyDto') verifyDto: VerifyDto): Promise<ResponseMessage | any> {
    return this.usersService.verify(verifyDto);
  }

  @Mutation(() => ResponseMessage, { name: "login" })
  async login(
    @Args('loginDto') loginDto: LoginDto,
    @Context('req') req: Request,
    @Context('res') res: Response
  ): Promise<ResponseMessage> {
    return this.usersService.login(loginDto, res as any);
  }

  @Mutation(() => ResponseMessage, { name: "forgotPassword" })
  async forgotPassword(@Args('data') forgotPasswordDto: ForgorPasswordDto): Promise<ResponseMessage | any> {
    try {
      return this.usersService.forgotPassword(forgotPasswordDto.email);
    } catch (error) {
      console.log(error);
    }
  }

  @Mutation(() => ResponseMessage, { name: "verifyForgotPassword" })
  async verifyForgotPassword(
    @Args("data") verifyForgotPasswordDto: VerifyForgotPasswordDto
  ): Promise<ResponseMessage> {
    return this.usersService.verifyForgotPassword(verifyForgotPasswordDto);
  }
  

  @Mutation(() => ResponseMessage, { name: "logout" })
  async logout(@Context('req') req: Request, @Context('res') res: Response): Promise<ResponseMessage> {
    return this.usersService.logout(req as any, res as any);
  }

}
