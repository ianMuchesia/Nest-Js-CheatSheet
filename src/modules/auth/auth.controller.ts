import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { IPayloadJwt } from './auth.interface';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { IRequestWithUser } from 'src/common/interfaces/http.interface';
import { JwtRefreshTokenAuthGuard } from './guards/jwt-refresh-token.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async register(@Body() registerDto: RegisterUserDto) {
    const user = await this.authService.register(registerDto);

    //you can set the cookie here

    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    return user;
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  public async login(@Req() req: IRequestWithUser) {
    const { user } = req;
    const payload: IPayloadJwt = {
      userId: user.id,
      email: user.email,
    };

    const accessTokenCookie = this.authService.getCookiesWithToken(payload);

  

    const { cookie: refreshTokenCookie, token: refreshToken } =
      this.authService.getCookiesWithJwtRefreshToken(payload);

      
    await this.authService.setCurrentRefreshToken(user, user.id);
  
    this.authService.setHeaderArray(req.res, [
      accessTokenCookie,
      refreshTokenCookie,
    ]);


    return user;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  public getAuthenticatedUser(@Req() req: IRequestWithUser) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    return req.user;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  public async logout(@Req() req: IRequestWithUser) {
    const { user } = req;
    await this.authService.removeRefreshToken(user);
    this.authService.clearCookie(req.res);
    return {
      logout: true,
    };
  }

  @UseGuards(JwtRefreshTokenAuthGuard)
  @Get('refresh')
  public refresh(@Req() req: IRequestWithUser) {
    const { user } = req;
    const payload: IPayloadJwt = {
      userId: user.id,
      email: user.email,
    };

    const accessTokenCookie = this.authService.getCookiesWithToken(payload);

    this.authService.setHeaderSingle(req.res, accessTokenCookie);

    return req.user;
  }
}
