import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = unknown>(
    err: unknown,
    user: TUser,
    info: { message?: string } | undefined,
  ): TUser {
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          info?.message || 'Acceso no autorizado: token ausente o inválido',
        )
      );
    }
    return user;
  }
}
