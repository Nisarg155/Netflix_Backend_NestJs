import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserJwtStrategy } from './strategies/user-jwt-strategy.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtService, UserJwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
