import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwtSecret'),
    });
  }

  async validate(payload: any) {
    try {
      const data = await this.authService.getUserById(payload.sub);
      return {
        id: data.user.userId,
        email: data.user.email,
        name: data.user.name,
        SubStatus: data.Substatus,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token error form jwt strategy');
    }
  }
}
