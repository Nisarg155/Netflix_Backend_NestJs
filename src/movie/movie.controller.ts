import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { type UserDetailsType } from '../auth/type/userDetails.type';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LoginThrottlerGuard } from '../auth/guards/login-throttler';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard, LoginThrottlerGuard)
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @Get('all')
  @HttpCode(HttpStatus.OK)
  async getMovies(
    @CurrentUser() user: UserDetailsType,
    @Query('page') page: number,
  ) {
    return await this.movieService.fetchAllMovies(user, page);
  }

  // keep this on top of get movie else it will always call getMovie due to :id param
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('search')
  @ApiQuery({ name: 'genre', required: false })
  @ApiQuery({ name: 'releaseYear', required: false })
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @HttpCode(HttpStatus.OK)
  async searchMovies(
    @CurrentUser() user: UserDetailsType,
    @Query('genre') genre?: string,
    @Query('releaseYear') releaseYear?: string,
    @Query('keyword') keyword?: string,
    @Query('page') page?: number,
  ) {
    return await this.movieService.searchMovies(
      user,
      genre,
      releaseYear,
      keyword,
      page,
    );
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getMovie(
    @Param('id') id: string,
    @CurrentUser() user: UserDetailsType,
  ) {
    return await this.movieService.fetchMovie(user, id);
  }
}
