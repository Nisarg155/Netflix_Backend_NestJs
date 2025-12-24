import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { WatchlistAddOperationsDto } from './dto/watchlist-add-operations.dto';
import { UserDetailsType } from '../auth/type/userDetails.type';
import { SubscriptionStatus } from '@prisma/client';
import { WatchlistRemoveOperationsDto } from './dto/watchlist-remove-operation.dto';

@Injectable()
export class WatchlistService {
  constructor(private readonly prismaService: PrismaService) {}

  async addMovieToWatchlist(
    data: WatchlistAddOperationsDto,
    user: UserDetailsType,
  ) {
    if (
      user.SubStatus === SubscriptionStatus.CANCELLED ||
      user.SubStatus === SubscriptionStatus.EXPIRED
    ) {
      throw new UnauthorizedException(
        `Can't add  movies to watchlist because your status is ${user.SubStatus}`,
      );
    } else if (user.SubStatus === 'None') {
      throw new UnauthorizedException("You Don't have any Subscription");
    }

    if (data.userId !== user.id) {
      throw new UnauthorizedException('UserId Does not match with token');
    }

    return this.prismaService.$transaction(async (tx) => {
      if (
        !(await tx.user.findUnique({
          where: {
            userId: data.userId,
          },
        }))
      ) {
        throw new NotFoundException('User Does not Exist');
      }

      if (
        !(await tx.content.findUnique({
          where: {
            contentId: data.contentId,
          },
        }))
      ) {
        throw new NotFoundException('Content not found.');
      }

      if (
        user.plan!.maxWatchlist === -1 ||
        (await tx.watchlist.count({
          where: {
            userId: data.userId,
          },
        })) < user.plan!.maxWatchlist
      ) {
        try {
          const watchlistItem = await tx.watchlist.create({
            data: {
              contentId: data.contentId,
              userId: data.userId,
            },
          });

          return {
            message: 'Content Added to Watchlist',
            Item: watchlistItem,
          };
        } catch (e) {
          throw new ConflictException('Content Already Exists in Watchlist');
        }
      } else {
        throw new ConflictException('Max Watchlist Limit  Reached');
      }
    });
  }

  async removeMovieFromWatchlist(
    data: WatchlistRemoveOperationsDto,
    user: UserDetailsType,
  ) {
    if (
      user.SubStatus === SubscriptionStatus.CANCELLED ||
      user.SubStatus === SubscriptionStatus.EXPIRED
    ) {
      throw new UnauthorizedException(
        `Can't add  movies to subscription because your status is ${user.SubStatus}`,
      );
    } else if (user.SubStatus === 'None') {
      throw new UnauthorizedException("You Don't have any Subscription");
    }

    if (data.userId !== user.id) {
      throw new UnauthorizedException('UserId Does not match with token');
    }

    return this.prismaService.$transaction(async (tx) => {
      if (
        !(await tx.user.findUnique({
          where: { userId: data.userId },
        }))
      ) {
        throw new NotFoundException('User Does not Exist');
      }
      try {
        await tx.watchlist.delete({
          where: { watchlistId: data.watchlistId },
        });
        return {
          message: 'Removed Movies from Watchlist',
        };
      } catch (e) {
        throw new ConflictException('Already Removed Movies from Watchlist');
      }
    });
  }

  async fetchAllFromWatchlist(user: UserDetailsType, userId: string) {
    if (
      user.SubStatus === SubscriptionStatus.CANCELLED ||
      user.SubStatus === SubscriptionStatus.EXPIRED
    ) {
      throw new UnauthorizedException(
        `Can't fetch Watchlist  because your status is ${user.SubStatus}`,
      );
    } else if (user.SubStatus === 'None') {
      throw new UnauthorizedException("You Don't have any Subscription");
    }

    if (userId !== user.id) {
      throw new UnauthorizedException('UserId Does not match with token');
    }

    if (
      !(await this.prismaService.user.findUnique({
        where: { userId: userId },
      }))
    ) {
      throw new NotFoundException('User Not Found');
    }
    return this.prismaService.watchlist.findMany({
      select: {
        watchlistId: true,
        userId: true,
        content: {
          select: {
            title: true,
            details: true,
            movie: {
              select: {
                movieUrl: true,
                thumbnailUrl: true,
              },
            },
          },
        },
      },
    });
  }
}
