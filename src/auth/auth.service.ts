import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { compare, genSalt, hash } from 'bcrypt';
import { SubscriptionStatus, User } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  // User Methods
  private async hashPassword(password: string): Promise<string> {
    const Salt = await genSalt(10);
    return await hash(password, Salt);
  }

  private async verifyPassword(
    password: string,
    original: string,
  ): Promise<boolean> {
    return await compare(password, original);
  }

  private generateToken(user: User): string {
    const payload = {
      email: user.email,
      sub: user.userId,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwtSecret'),
      expiresIn: '15m',
    });
  }

  async getUserById(id: string) {
    return this.prismaService.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { userId: id },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const latestsubscription = await tx.subscription.findFirst({
        where: { userId: id },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          status: true,
          endDate: true,
          plan: {
            select: {
              planId: true,
              name: true,
              maxQuality: true,
              maxUsers: true,
              maxWatchlist: true,
            },
          },
        },
      });

      if (!latestsubscription) {
        const { password, ...result } = user;

        return {
          user: result,
          Substatus: 'None',
          plan: null,
        };
      } else {
        let SubStatus: string = 'ACTIVE';
        const now = new Date();
        if (latestsubscription.status === SubscriptionStatus.CANCELLED) {
          SubStatus = 'CANCELLED';
        } else if (
          latestsubscription.endDate <= now ||
          latestsubscription.status === SubscriptionStatus.EXPIRED
        ) {
          SubStatus = 'EXPIRED';
        }

        const { password, ...result } = user;
        return {
          user: result,
          Substatus: SubStatus,
          plan: latestsubscription.plan,
        };
      }
    });
  }

  async register(registrationData: RegisterDto) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: registrationData.email },
    });

    if (!existingUser) {
      registrationData.password = await this.hashPassword(
        registrationData.password,
      );

      const newUser = await this.prismaService.user.create({
        data: registrationData,
      });

      const { password, ...user } = newUser;

      return {
        user: user,
        message: 'User Registered Successfully',
      };
    } else {
      throw new ConflictException('User already exists');
    }
  }

  async login(loginData: LoginDto) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: loginData.email },
    });

    if (
      !existingUser ||
      !(await this.verifyPassword(loginData.password, existingUser.password))
    ) {
      throw new UnauthorizedException(
        'Invalid Credentials or Account does not exist ',
      );
    }

    const token = this.generateToken(existingUser);
    const { password, ...result } = existingUser;
    return {
      user: result,
      token: token,
      message: 'User Login Successfull',
    };
  }
}
