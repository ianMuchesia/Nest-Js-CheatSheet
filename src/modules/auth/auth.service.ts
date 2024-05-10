import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto';
import { IPayloadJwt } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async validateUser(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return user;
      }
    }

    throw new BadRequestException('Invalid credentials');
  }

  public async register(registerDto: RegisterUserDto) {
    const userCheck = await this.userService.getUserByEmail(registerDto.email);

    if (userCheck) {
      throw new ConflictException(
        `User with email ${registerDto.email} already exists`,
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(registerDto.password, salt);

    try {
      const user = await this.userService.create({
        ...registerDto,
        password: hashedPassword,
      });

      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public getCookiesWithToken(payload: IPayloadJwt) {
   
    const token = this.jwtService.sign(payload);
   
    return `Authorization=${token};HttpOnly;Path=/;Max-Age=${process.env.JWT_EXPIRATION_TIME}`;
  }

  public clearCookie() {
    return `Authorization=;HttpOnly;Path=/;Max-Age=0`;
  }
}
