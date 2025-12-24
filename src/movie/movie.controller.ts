import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { MovieService } from './movie.service';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { type UserDetailsType } from '../auth/type/type';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @Get('all')
  async getMovies(
    @CurrentUser() user: UserDetailsType,
    @Query('page') page: number,
  ) {
    return await this.movieService.fetchAllMovies(user, page);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('search')
  @ApiQuery({ name: 'genre', required: false })
  @ApiQuery({ name: 'releaseYear', required: false })
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
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
  async getMovie(
    @Param('id') id: string,
    @CurrentUser() user: UserDetailsType,
  ) {
    return await this.movieService.fetchMovie(user, id);
  }
}
