import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const [bearer, accessToken] = authHeader.split(' ');

    if (bearer !== 'Bearer') {
      throw new UnauthorizedException('Authorization header not Bearer type');
    }

    const session = await this.usersService.findSession({ accessToken });

    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    if (Date.now() > session.accessTokenValidUntil.getTime()) {
      throw new UnauthorizedException('Access token expired');
    }

    const user = await this.usersService.findUser({ _id: session.userId });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    req.user = user;

    next();
  }
}
