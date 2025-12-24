import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { type UserDetailsType } from '../auth/type/userDetails.type';
import { AddRatingDto } from './add-rating.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post('add')
  @HttpCode(HttpStatus.CREATED)
  async addRating(
    @CurrentUser() user: UserDetailsType,
    @Body() ratingData: AddRatingDto,
  ) {
    return this.ratingService.addRating(ratingData, user);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('all')
  @HttpCode(HttpStatus.OK)
  async getAllRatings(
    @CurrentUser() user: UserDetailsType,
    @Query('page') page: number,
  ) {
    return this.ratingService.fetchRatings(user, page);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getRating(
    @CurrentUser() user: UserDetailsType,
    @Param('id') id: string,
  ) {
    return this.ratingService.fetchRating(user, id);
  }
}
