import { Module } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { WatchlistController } from './watchlist.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [WatchlistController],
  providers: [WatchlistService],
  imports: [AuthModule],
})
export class WatchlistModule {}
