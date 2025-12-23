import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BuySubscriptionDto } from './dto/buy-subscription.dto';
import { PrismaService } from '../db/prisma.service';
import { SubscriptionStatus } from '@prisma/client';
import { UpgradeSubscriptionDto } from './dto/upgrade-subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prismaService: PrismaService) {}

  private addDuration(startDate: Date, duration: string): Date {
    const value = parseInt(duration.slice(0, -1), 10);
    const unit = duration.slice(-1);

    const result = new Date(startDate);

    switch (unit) {
      case 'd':
        result.setDate(result.getDate() + value);
        break;

      case 'm':
        result.setMonth(result.getMonth() + value);
        break;

      case 'y':
        result.setFullYear(result.getFullYear() + value);
        break;

      default:
        throw new Error('Invalid duration format');
    }

    return result;
  }

  private convertToDays(duration: string): number {
    const unit = duration.slice(-1);
    const days = duration.slice(0, -1);

    switch (unit) {
      case 'd':
        return parseInt(days);

      case 'm':
        return parseInt(days) * 30;

      case 'y':
        return parseInt(days) * 365;

      default:
        throw new Error('Invalid duration format');
    }
  }

  private async checkActiveSubscription(
    userId: string,
    currentDate: Date,
  ): Promise<boolean> {
    const subscription = await this.prismaService.subscription.findFirst({
      where: {
        userId: userId,
        status: SubscriptionStatus.ACTIVE,
        endDate: {
          gt: currentDate, // endDate > currentDate
        },
      },
    });

    return !!subscription;
  }

  async purchaseSubscription(subscriptionData: BuySubscriptionDto) {
    const startDate = new Date(subscriptionData.startDate);

    return this.prismaService.$transaction(async (tx) => {
      await tx.user.findUniqueOrThrow({
        where: { userId: subscriptionData.userId },
      });

      const plan = await tx.plan.findUniqueOrThrow({
        where: { planId: subscriptionData.planId },
      });

      const hasActiveSubscription = await tx.subscription.findFirst({
        where: {
          userId: subscriptionData.userId,
          status: SubscriptionStatus.ACTIVE,
          endDate: { gt: startDate },
        },
      });

      if (hasActiveSubscription) {
        throw new ConflictException(
          'Subscription already exists and is active',
        );
      }

      const durationRegex = /^\d+[dmy]$/;
      if (!durationRegex.test(plan.duration)) {
        throw new BadRequestException('Invalid plan duration format');
      }

      const endDate = this.addDuration(startDate, plan.duration);

      const subscription = await tx.subscription.create({
        data: {
          userId: subscriptionData.userId,
          planId: subscriptionData.planId,
          startDate,
          endDate,
          status: SubscriptionStatus.ACTIVE,
        },
      });

      return {
        message: 'Subscription was successfully created',
        details: subscription,
      };
    });
  }

  async cancelSubscription(subscriptionId: string) {
    try {
      return await this.prismaService.$transaction(async (tx) => {
        const subscription = await tx.subscription.findUniqueOrThrow({
          where: {
            subId: subscriptionId,
          },
        });

        console.log(subscription);

        if (subscription.status === 'CANCELLED') {
          throw new ConflictException('Subscription already cancelled');
        }

        await tx.subscription.update({
          where: { subId: subscriptionId },
          data: {
            status: SubscriptionStatus.CANCELLED,
          },
        });

        return {
          message: `Subscription  successfully cancelled`,
        };
      });
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (e.code === 'P2025') {
        throw new NotFoundException('Subscription Not Found');
      } else {
        throw e;
      }
    }
  }

  async upgradeSubscription(updateData: UpgradeSubscriptionDto) {
    return this.prismaService.$transaction(async (tx) => {
      if (
        !(await tx.user.findUnique({
          where: { userId: updateData.userId },
        }))
      ) {
        throw new NotFoundException('User Not found');
      }

      const subscription = await tx.subscription.findUnique({
        where: { subId: updateData.subId },
        include: {
          plan: true,
        },
      });

      if (!subscription) {
        throw new NotFoundException('Subscription Not Found');
      } else if (
        subscription.status === 'CANCELLED' ||
        subscription.status === 'EXPIRED'
      ) {
        throw new BadRequestException(
          `Can't Upgrade ,Subscription already ${subscription.status}`,
        );
      }
      const plan = await tx.plan.findUnique({
        where: { planId: updateData.planId },
      });

      if (!plan) {
        throw new NotFoundException('Plan Not Found');
      }

      if (subscription.planId === updateData.planId) {
        throw new ConflictException('Subscription already updated to the plan');
      }
      const today = new Date();
      const remainingDays = Math.max(
        0,
        Math.ceil(
          (subscription.endDate.getTime() - today.getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      );

      if (remainingDays === 0) {
        await tx.subscription.update({
          where: { subId: updateData.subId },
          data: {
            status: SubscriptionStatus.EXPIRED,
          },
        });
        throw new ConflictException('Subscription Already Expired');
      } else {
        const oldPlanDays = this.convertToDays(subscription.plan.duration);
        const newPlanDays = this.convertToDays(plan.duration);
        const oldPricePerDay = subscription.plan.price / oldPlanDays;
        const newPricePerDay = plan.price / newPlanDays;
        const priceDifference = newPricePerDay - oldPricePerDay;
        const priceToPay = priceDifference * remainingDays;
        console.log(
          oldPlanDays,
          newPlanDays,
          oldPricePerDay,
          newPricePerDay,
          priceDifference,
        );

        const newSubscription = await tx.subscription.update({
          where: { subId: updateData.subId },
          data: {
            planId: updateData.planId,
          },
          include: {
            plan: true,
          },
        });

        return {
          message: `Subscription Updated Successfully , Remaining Amount to pay ${priceToPay}`,
          details: newSubscription,
        };
      }
    });
  }

  async findAllById(UserId: string) {
    return await this.prismaService.$transaction(async (tx) => {
      if (!(await tx.user.findUnique({ where: { userId: UserId } }))) {
        throw new NotFoundException('User Not Found');
      }
      return tx.subscription.findMany({
        where: { userId: UserId },
      });
    });
  }

  async findLatest(userId: string) {
    return await this.prismaService.$transaction(async (tx) => {
      if (!(await tx.user.findUnique({ where: { userId: userId } }))) {
        throw new NotFoundException('User Not Found');
      }

      const now = new Date();

      const subscription = await this.prismaService.subscription.findFirst({
        where: {
          userId,
        },
        orderBy: {
          createdAt: 'desc', // latest subscription
        },
        include: {
          plan: true, // optional, if you want plan details
        },
      });

      if (!subscription) {
        throw new NotFoundException('No subscription found for user');
      }

      if (subscription.status === SubscriptionStatus.CANCELLED) {
        return {
          status: 'CANCELLED',
          details: subscription,
        };
      }

      if (subscription.endDate <= now) {
        return {
          status: 'EXPIRED',
          expiredAt: subscription.endDate,
          details: subscription,
        };
      }

      return {
        status: 'ACTIVE',
        validTill: subscription.endDate,
        details: subscription,
      };
    });
  }
}
