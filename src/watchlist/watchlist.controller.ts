import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { type UserDetailsType } from '../auth/type/userDetails.type';
import { WatchlistAddOperationsDto } from './dto/watchlist-add-operations.dto';
import { WatchlistRemoveOperationsDto } from './dto/watchlist-remove-operation.dto';
import { LoginThrottlerGuard } from '../auth/guards/login-throttler';

@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @UseGuards(JwtAuthGuard)
  @Post('add')
  @HttpCode(HttpStatus.CREATED)
  async addToWatchlist(
    @CurrentUser() user: UserDetailsType,
    @Body() WatchlistItem: WatchlistAddOperationsDto,
  ) {
    return await this.watchlistService.addMovieToWatchlist(WatchlistItem, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('remove')
  @HttpCode(HttpStatus.OK)
  async removeFromWatchlist(
    @CurrentUser() user: UserDetailsType,
    @Body() data: WatchlistRemoveOperationsDto,
  ) {
    return await this.watchlistService.removeMovieFromWatchlist(data, user);
  }

  @UseGuards(JwtAuthGuard, LoginThrottlerGuard)
  @Get('all/:id')
  @HttpCode(HttpStatus.OK)
  async getAllWatchlist(
    @CurrentUser() user: UserDetailsType,
    @Param('id') userId: string,
  ) {
    return await this.watchlistService.fetchAllFromWatchlist(user, userId);
  }
}
