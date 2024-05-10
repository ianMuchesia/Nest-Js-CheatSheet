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

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async register(@Body() registerDto: RegisterUserDto) {
    const user = await this.authService.register(registerDto);

    //you can set the cookie here


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  public async login(@Req() req: IRequestWithUser) {
    const { user } = req;
    const payload: IPayloadJwt = {
      userId: user.id,
      email: user.email,
    };

  
    const cookie = this.authService.getCookiesWithToken(payload);
    req.res.setHeader('Set-Cookie', cookie);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
   
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
  public async logout(@Res() res: Response) {
    res.setHeader('Set-Cookie', this.authService.clearCookie());
    return res.sendStatus(200);
  }
}