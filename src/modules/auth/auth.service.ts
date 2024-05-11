import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus, Injectable
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from './dto';
import { IPayloadJwt } from './auth.interface';
import { User } from '../user/user.entity';
import { Response } from 'express';

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

  public async removeRefreshToken(user: User): Promise<User> {
    return await this.clearRefreshToken(user);
  }

  public getCookiesWithJwtRefreshToken(payload: IPayloadJwt) {
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    });

    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}`;
    return {
      cookie,
      token,
    };
  }

  public async setCurrentRefreshToken(
    user: User,
    refreshToken: string,
  ): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, salt);
   
    return await this.updateRefreshToken(
      user,
      currentHashedRefreshToken,
    );
  }

  public clearCookie(res: Response): void {
    const emptyCookie = [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
    res.setHeader('Set-Cookie', emptyCookie);
  }

  public setHeaderSingle(res: Response, cookie: string): void {
    res.setHeader('Set-Cookie', cookie);
  }
  public setHeaderArray(res: Response, cookies: string[]): void {
    res.setHeader('Set-Cookie', cookies);
  }

  public async getUserById(id: string): Promise<User> {
    return await this.userService.getUserById(id);
  }

  public async updateRefreshToken(
    user: User,
    currentHashedRefreshToken: string,
  ) {
    console.log(this);
    console.log(currentHashedRefreshToken);

    await this.userService.saveToken(user, currentHashedRefreshToken);
    return user;
  }

  public async getUserIfRefreshTokenMatches(
    refreshToken: string,
    userId: string,
  ) {
    const user = await this.getUserById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }

    return null;
  }

  public async clearRefreshToken(user: User) {
    await this.userService.saveToken(user, null);
    return user;
  }
}
