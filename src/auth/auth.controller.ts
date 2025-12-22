import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { LoginThrottlerGuard } from './guards/login-throttler';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // User Routes

  @ApiCreatedResponse({
    description: 'User registered successfully',
    type: RegisterResponseDto,
  })
  @ApiConflictResponse({
    description: 'User already exists',
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
  })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registrationData: RegisterDto) {
    return this.authService.register(registrationData);
  }

  @UseGuards(LoginThrottlerGuard)
  @Post('login')
  @ApiOkResponse({
    description: 'User logged in successfully',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials or account does not exist',
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
  })
  async login(@Body() loginData: LoginDto) {
    return this.authService.login(loginData);
  }

  // Admin Routes

  @Post('create-admin')
  @HttpCode(HttpStatus.CREATED)
  async createAdmin(@Body() adminData: RegisterDto) {
    return this.authService.createAdmin(adminData);
  }

  @UseGuards(LoginThrottlerGuard)
  @Post('admin-login')
  @HttpCode(HttpStatus.OK)
  async loginAdmin(@Body() adminData: LoginDto) {
    return this.authService.loginAdmin(adminData);
  }
}
