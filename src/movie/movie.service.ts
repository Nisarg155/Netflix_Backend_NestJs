import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { UserDetailsType } from '../auth/type/userDetails.type';
import { SubscriptionStatus } from '@prisma/client';

@Injectable()
export class MovieService {
  constructor(private readonly prismaService: PrismaService) {}

  async fetchAllMovies(
    user: UserDetailsType,
    page = 1, // default page
  ) {
    if (
      user.SubStatus === SubscriptionStatus.CANCELLED ||
      user.SubStatus === SubscriptionStatus.EXPIRED
    ) {
      throw new UnauthorizedException(
        `Can't fetch movies because your status is ${user.SubStatus}`,
      );
    } else if (user.SubStatus === 'None') {
      throw new UnauthorizedException("You don't have any Subscription");
    }

    const LIMIT = 15;
    const skip = (page - 1) * LIMIT;

    return this.prismaService.content.findMany({
      where: {
        type: 'MOVIE',
      },
      skip,
      take: LIMIT,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        contentId: true,
        title: true,
        releaseYear: true,
        language: true,
        averageRating: true,
        ratingCount: true,
        ratings: {
          select: {
            rating: true,
            comment: true,
          },
          take: LIMIT,
        },
        movie: {
          select: {
            movieUrl: true,
            thumbnailUrl: true,
            duration: true,
          },
        },

        genres: {
          select: {
            genre: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async fetchMovie(user: UserDetailsType, contentId: string) {
    if (
      user.SubStatus === SubscriptionStatus.CANCELLED ||
      user.SubStatus === SubscriptionStatus.EXPIRED
    ) {
      throw new UnauthorizedException(
        `Can't fetch movies because your status is ${user.SubStatus}`,
      );
    } else if (user.SubStatus === 'None') {
      throw new UnauthorizedException("You Don't have any Subscription");
    }

    const movie = await this.prismaService.content.findUnique({
      where: { contentId: contentId },
      select: {
        contentId: true,
        title: true,
        releaseYear: true,
        language: true,
        details: true,
        averageRating: true,
        ratingCount: true,
        ratings: {
          select: {
            rating: true,
            comment: true,
          },
          take: 15,
        },

        movie: {
          select: {
            movieUrl: true,
            thumbnailUrl: true,
            duration: true,
          },
        },
        genres: {
          select: {
            genre: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    return {
      message: 'Movie found',
      movie,
    };
  }

  async searchMovies(
    user: UserDetailsType,
    genre: string | undefined,
    releaseYear: string | undefined,
    keyword: string | undefined,
    page = 1,
  ) {
    if (
      user.SubStatus === SubscriptionStatus.CANCELLED ||
      user.SubStatus === SubscriptionStatus.EXPIRED
    ) {
      throw new UnauthorizedException(
        `Can't fetch movies because your status is ${user.SubStatus}`,
      );
    } else if (user.SubStatus === 'None') {
      throw new UnauthorizedException("You Don't have any Subscription");
    }

    if (!genre && !releaseYear && !keyword) {
      throw new NotFoundException('Provide query to search');
    }

    const LIMIT = 15;
    const skip = (page - 1) * LIMIT;
    return this.prismaService.content.findMany({
      where: {
        type: 'MOVIE',

        ...(releaseYear && {
          releaseYear,
        }),
        ...(keyword && {
          OR: [
            {
              title: {
                contains: keyword,
                mode: 'insensitive',
              },
            },
            {
              details: {
                contains: keyword,
                mode: 'insensitive',
              },
            },
          ],
        }),
        ...(genre && {
          genres: {
            some: {
              genre: {
                name: {
                  // to make genre search insensitive to the case
                  equals: genre,
                  mode: 'insensitive',
                },
              },
            },
          },
        }),
      },
      skip,
      take: LIMIT,
      select: {
        contentId: true,
        title: true,
        details: true,
        releaseYear: true,
        language: true,
        averageRating: true,
        ratingCount: true,
        ratings: {
          select: {
            rating: true,
            comment: true,
          },
          take: LIMIT,
        },
        movie: {
          select: {
            movieUrl: true,
            thumbnailUrl: true,
            duration: true,
          },
        },
        genres: {
          select: {
            genre: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }
}
