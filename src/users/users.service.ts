import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "./entities/user.entity";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import sendVerificationEmail from "src/utils/email_service";
import { LoginDto } from "./dto/login-dto";
import { Request, Response } from "express";
import { VerifyDto } from "./dto/verify.dto";
import { UserInput } from "./dto/user-input.dto";
import { ResponseMessage } from "./users.resolver";
import { Context } from "@nestjs/graphql";
import sendForgotPasswordEmail from "src/utils/forgot_password_email_sender";
import { VerifyForgotPasswordDto } from "./dto/verify_forgot_password.dto";
import { PurchaseEntity } from "src/purchase/entities/purchase.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(PurchaseEntity)
    private purchaseRepository: Repository<PurchaseEntity>
  ) {}

  async getPurchasesByUserId(userId: number): Promise<PurchaseEntity[]> {
    return this.purchaseRepository.find({
      where: { user: { id: userId } },
      relations: ['book', 'user'], 
    });
  }

  async register(userData: UserInput): Promise<ResponseMessage> {
    try {
      const { username, email, password } = userData;
      const foundUser = await this.userRepository.findOneBy({ email });
      if (foundUser) {
        throw new HttpException(
          "User already registered!",
          HttpStatus.FORBIDDEN
        );
      }

      const randomCode = Math.floor(100000 + Math.random() * 900000);
      await sendVerificationEmail(username, email, randomCode);

      const encodedPassword = await bcrypt.hash(password, 12);
      const deadline = new Date(Date.now() + 2 * 60 * 1000);

      const newUser = this.userRepository.create({
        username,
        email,
        password: encodedPassword,
        verificationCode: randomCode,
        timestamp: deadline,
      });

      await this.userRepository.save(newUser);
      return { message: `Verification code sent to your email: ${email}` };
    } catch (error) {
      return { message: `Something went wrong! Error: ${error.message}` };
    }
  }

  async verify(verifyDto: VerifyDto): Promise<ResponseMessage | any> {
    try {
      const { email, verificationCode } = verifyDto;
      const foundUser = await this.userRepository.findOne({ where: { email } });

      if (!foundUser) {
        throw new HttpException("User not found!", HttpStatus.NOT_FOUND);
      }

      if (
        new Date() <= foundUser.timestamp &&
        Number(verificationCode) === foundUser.verificationCode
      ) {
        await this.userRepository.update(foundUser.id, {
          isVerified: true,
          verificationCode: 0,
        });

        return { message: "You successfully verified!" };
      } else {
        return { message: "Ooops, verifying code failed!\nPlease, try again." };
      }
    } catch (error) {
      return { message: "Something went wrong!", error: error.message };
    }
  }

  async login(
    loginDto: LoginDto,
    @Context("res") res: Response
  ): Promise<ResponseMessage> {
    try {
      const { email, password } = loginDto;
      const foundUser = await this.userRepository.findOne({ where: { email } });

      if (!foundUser) {
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
      }

      const checkPassword = await bcrypt.compare(password, foundUser.password);
      if (!checkPassword) {
        throw new HttpException("Password is wrong!", HttpStatus.UNAUTHORIZED);
      }

      const payload = {
        username: foundUser.username,
        email: foundUser.email,
        role: foundUser.role,
      };

      const accesstoken = this.generateAccessToken(payload);
      const refreshtoken = this.generateRefreshToken(payload);

      if (foundUser.isVerified) {
        res.cookie("accesstoken", accesstoken, {
          httpOnly: true,
          maxAge: 15 * 60 * 1000,
        });

        res.cookie("refreshtoken", refreshtoken, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return { message: "You successfully logged in!" };
      } else {
        return { message: "You have not verified yet!" };
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async forgotPassword(email: string): Promise<ResponseMessage> {
    const foundUser = await this.userRepository.findOne({ where: { email } });
  
    if (!foundUser) {
      throw new BadRequestException("Foydalanuvchi topilmadi!");
    }
  
    if (!foundUser.isVerified) {
      throw new BadRequestException(
        "Sizning emailingiz tasdiqlanmagan, avval emailingizni tasdiqlang!"
      );
    }
  
    const randomCode = Array.from({ length: 7 }, () =>
      Math.floor(Math.random() * 10)
    ).join("");
  
    await sendForgotPasswordEmail(foundUser.username, email, randomCode);
  
    foundUser.timestamp = new Date(Date.now() + 2 * 60 * 1000);
    foundUser.passwordRecoverCode = +randomCode;
    foundUser.attempts = 0;
    await this.userRepository.save(foundUser);
  
    return { message: `${email} ga parolni tiklash uchun kod yuborildi.` };
  }
  
  async verifyForgotPassword(
    data: VerifyForgotPasswordDto
  ): Promise<ResponseMessage> {
    const { email, code, newPassword } = data;
    const foundUser = await this.userRepository.findOne({ where: { email } });
  
    if (!foundUser) {
      throw new Error("Bunday foydalanuvchi topilmadi!");
    }
  
    if (foundUser.allowedTime && new Date(foundUser.allowedTime).getTime() > Date.now()) {
      console.log("Timestamp:", foundUser.allowedTime, "Converted:", new Date(foundUser.timestamp).getTime());
      throw new UnauthorizedException(
        "Siz ko'p marotaba noto'g'ri kod kiritgansiz! Keyinroq urinib ko'ring!"
      );
    }
  
    if (
      Date.now() <= new Date(foundUser.timestamp).getTime() &&
      code === foundUser.passwordRecoverCode
    ) {
      const encodedPassword = await bcrypt.hash(newPassword, 12);
      await this.userRepository.update(
        { email },
        { passwordRecoverCode: 0, password: encodedPassword }
      );
      return { message: "Parolni tiklash kodi tasdiqlandi va parol yangilandi!" };
    }
  
    foundUser.attempts += 1;
  
    if (foundUser.attempts > 3) {
      foundUser.allowedTime = new Date(Date.now() + 1000 * 60 * 15); 
      foundUser.attempts = 0;
      await this.userRepository.save(foundUser);
      throw new Error(
        "Siz juda ko'p noto'g'ri kod kiritdingiz! Iltimos, keyinroq urinib ko'ring!"
      );
    }
  
    await this.userRepository.save(foundUser);
    throw new Error("Kod tasdiqlanmadi!");
  }  

  async logout(
    @Context("req") req: Request,
    @Context("res") res: Response
  ): Promise<ResponseMessage> {
    try {
      const token = req.cookies.refreshtoken;
      if (!token) {
        throw new UnauthorizedException("Token not found!");
      }
      jwt.verify(token, process.env.REFRESH_SECRET_KEY as string);
      res.clearCookie("accesstoken");
      res.clearCookie("refreshtoken");

      return { message: "You are logged out!" };
    } catch (error) {
      throw new UnauthorizedException("Invalid token!");
    }
  }
  private generateAccessToken(payload: object): string {
    const secretKey = process.env.ACCESS_SECRET_KEY;
    if (!secretKey) throw new Error("ACCESS_SECRET_KEY is not defined");
    return jwt.sign(payload, secretKey, {
      expiresIn: process.env.ACCESS_EXPIRING_TIME,
    } as any);
  }

  private generateRefreshToken(payload: object): string {
    const secretKey = process.env.REFRESH_SECRET_KEY;
    if (!secretKey) throw new Error("REFRESH_SECRET_KEY is not defined");
    return jwt.sign(payload, secretKey, {
      expiresIn: process.env.REFRESH_EXPIRING_TIME,
    } as any);
  }
}
