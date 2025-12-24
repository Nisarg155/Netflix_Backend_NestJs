import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import { PrismaModule } from './db/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { PlanModule } from './plan/plan.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { MovieModule } from './movie/movie.module';
import { WatchlistModule } from './watchlist/watchlist.module';
import { RatingModule } from './rating/rating.module';

@Module({
  imports: [
    // this thing will automatically load all the variable present in env files
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    // To rate limit
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 5,
        },
      ],
    }),
    PrismaModule,
    AuthModule,
    PlanModule,
    SubscriptionModule,
    MovieModule,
    WatchlistModule,
    RatingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
