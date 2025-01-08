import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserBodyDto } from './dto/registerUserBodyDto';
import { Request, Response } from 'express';
import { UserLoginDto } from './dto/userLoginDto';
import { setupSession } from 'src/utils/setupSession';

@Controller('auth')
export class UsersController {
  constructor(private usersServies: UsersService) {}

  @Post('register')
  async registerUser(@Body() body: RegisterUserBodyDto) {
    await this.usersServies.register(body);

    return {
      status: HttpStatus.CREATED,
      message: `Successffuly register user!`,
    };
  }

  @Get('verify')
  async verifyEmailUser(@Query('token') token: string) {
    await this.usersServies.verify(token);

    return { status: HttpStatus.OK, message: 'User successfully verified' };
  }

  @Post('login')
  async loginUser(
    @Body() body: UserLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const session = await this.usersServies.login(body);

    setupSession(res, session);

    return {
      status: HttpStatus.CREATED,
      message: 'Successfully loggin user!',
      data: { accessToken: session.accessToken },
    };
  }

  @Post('refresh')
  async refreshSession(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const session = await this.usersServies.refreshSession({
      sessionId: req.cookies.sessionId,
      refreshToken: req.cookies.refreshToken,
    });

    setupSession(res, session);

    return {
      status: HttpStatus.CREATED,
      message: 'Session successfully refresh',
      data: { accessToken: session.accessToken },
    };
  }

  @Post('logout')
  async logoutUser(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { sessionId } = req.cookies;

    if (sessionId) {
      await this.usersServies.logout(sessionId);

      res.clearCookie('sessionId');
      res.clearCookie('refreshToken');

      return {
        message: 'User successfully logout',
        status: HttpStatus.NO_CONTENT,
      };
    }
    throw new UnauthorizedException('Session not found');
  }
}
