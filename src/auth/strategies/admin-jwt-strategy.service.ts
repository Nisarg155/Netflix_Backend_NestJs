import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('adminJwtSecret'),
    });
  }
  async validate(payload: any) {
    try {
      const admin = await this.authService.getAdminById(payload.sub);
      return {
        id: admin.adminId,
        email: admin.email,
        name: admin.name,
      };
    } catch (error) {
      throw new UnauthorizedException(
        'Invalid token error form admin jwt strategy',
      );
    }
  }
}
