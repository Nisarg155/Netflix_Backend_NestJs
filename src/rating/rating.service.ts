import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AddRatingDto } from './dto/add-rating.dto';
import { UserDetailsType } from '../auth/type/userDetails.type';
import { SubscriptionStatus } from '@prisma/client';
import { PrismaService } from '../db/prisma.service';
import { UpdateRatingDto } from './dto/update-rating.dto';

@Injectable()
export class RatingService {
  constructor(private readonly prismaService: PrismaService) {}

  async addRating(ratingData: AddRatingDto, user: UserDetailsType) {
    if (
      user.SubStatus === SubscriptionStatus.CANCELLED ||
      user.SubStatus === SubscriptionStatus.EXPIRED
    ) {
      throw new UnauthorizedException(
        `Can't add rating because your status is ${user.SubStatus}`,
      );
    } else if (user.SubStatus === 'None') {
      throw new UnauthorizedException("You don't have any Subscription");
    }

    return this.prismaService.$transaction(async (tx) => {
      console.log(ratingData, user);
      if (
        !(await tx.user.findUnique({
          where: {
            userId: ratingData.userId,
          },
        }))
      ) {
        throw new NotFoundException('User Does not Exist');
      }

      const content = await tx.content.findUnique({
        where: {
          contentId: ratingData.contentId,
        },
      });
      if (!content) {
        throw new NotFoundException('Content not found.');
      }

      const oldAvgRating = content.averageRating;
      const oldRatingCount = content.ratingCount;
      const newRatingCount = oldRatingCount + 1;
      const newAvgRating =
        (oldAvgRating * oldRatingCount + ratingData.rating) / newRatingCount;

      await tx.content.update({
        where: {
          contentId: ratingData.contentId,
        },
        data: {
          averageRating: newAvgRating,
          ratingCount: newRatingCount,
        },
      });

      const existingRating = await tx.ratings.findUnique({
        where: {
          contentId_userId: {
            contentId: ratingData.contentId,
            userId: user.id,
          },
        },
      });

      if (existingRating) {
        throw new ConflictException('You have already rated this content');
      }

      return tx.ratings.create({
        data: {
          contentId: ratingData.contentId,
          userId: ratingData.userId,
          rating: ratingData.rating,
          comment: ratingData.comment,
        },
      });
    });
  }

  async fetchRatings(user: UserDetailsType, page: number) {
    if (
      user.SubStatus === SubscriptionStatus.CANCELLED ||
      user.SubStatus === SubscriptionStatus.EXPIRED
    ) {
      throw new UnauthorizedException(
        `Can't add rating because your status is ${user.SubStatus}`,
      );
    } else if (user.SubStatus === 'None') {
      throw new UnauthorizedException("You don't have any Subscription");
    }

    const LIMIT = 15;
    const skip = (page - 1) * LIMIT;
    return this.prismaService.ratings.findMany({
      where: {
        userId: user.id,
      },
      select: {
        contentId: true,
        rating: true,
        comment: true,
      },
      take: LIMIT,
      skip,
    });
  }

  async fetchRating(user: UserDetailsType, ratingId: string) {
    if (
      user.SubStatus === SubscriptionStatus.CANCELLED ||
      user.SubStatus === SubscriptionStatus.EXPIRED
    ) {
      throw new UnauthorizedException(
        `Can't add rating because your status is ${user.SubStatus}`,
      );
    } else if (user.SubStatus === 'None') {
      throw new UnauthorizedException("You don't have any Subscription");
    }

    const rating = await this.prismaService.ratings.findUnique({
      where: { ratingId: ratingId },
      select: {
        contentId: true,
        rating: true,
        comment: true,
        content: {
          select: {
            title: true,
            details: true,
            averageRating: true,
            ratingCount: true,
          },
        },
      },
    });

    if (!rating) {
      throw new NotFoundException('Rating Not Found');
    }

    return {
      message: 'Rating fetch successfully',
      data: rating,
    };
  }

  async updateRating(user: UserDetailsType, ratingData: UpdateRatingDto) {
    if (
      user.SubStatus === SubscriptionStatus.CANCELLED ||
      user.SubStatus === SubscriptionStatus.EXPIRED
    ) {
      throw new UnauthorizedException(
        `Can't add rating because your status is ${user.SubStatus}`,
      );
    } else if (user.SubStatus === 'None') {
      throw new UnauthorizedException("You don't have any Subscription");
    }

    const rating = await this.prismaService.ratings.findUnique({
      where: {
        ratingId: ratingData.ratingId,
      },
    });

    if (!rating) {
      throw new NotFoundException('Rating Not Found');
    }

    if (!ratingData.rating && !ratingData.comment) {
      throw new ConflictException('Provide Some data to update the rating');
    }

    return this.prismaService.ratings.update({
      where: { ratingId: ratingData.ratingId },
      data: {
        ...(ratingData.rating !== undefined && { rating: ratingData.rating }),
        ...(ratingData.comment !== undefined && {
          comment: ratingData.comment,
        }),
      },
      select: {
        ratingId: true,
        rating: true,
        comment: true,
      },
    });
  }
}
