import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ROLE } from '../constants';
import * as Response from '../response.messages';
import { ROLE_KEY } from './checkRole.decorator';
import { GenerateToken } from './dto/generate-token.dto';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector, private authService: AuthService) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  async handleRequest(
    _err: never,
    user: GenerateToken,
    _info: never,
    context: ExecutionContext,
  ): Promise<GenerateToken> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (requiredRoles)
      if (!user.roleId || !requiredRoles.includes(ROLE[user.roleId])) {
        throw new HttpException(Response.NO_ACCESS, HttpStatus.FORBIDDEN);
      }

    if (!(await this.authService.checkIsActive(user.tokenId || ''))) {
      throw new HttpException(
        Response.AUTHENTICATED_ERROR,
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }
}
