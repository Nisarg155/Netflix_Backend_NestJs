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
import { SubscriptionService } from './subscription.service';
import { BuySubscriptionDto } from './dto/buy-subscription.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpgradeSubscriptionDto } from './dto/upgrade-subscription.dto';

@ApiTags('Subscription')
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post('purchase')
  @HttpCode(HttpStatus.CREATED)
  async buySubscription(@Body() subscriptionData: BuySubscriptionDto) {
    return await this.subscriptionService.purchaseSubscription(
      subscriptionData,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete('cancel/:id')
  @HttpCode(HttpStatus.OK)
  async cancelSubscription(@Param('id') id: string) {
    return await this.subscriptionService.cancelSubscription(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post('upgrade-subscription')
  @HttpCode(HttpStatus.CREATED)
  async upgradeSubscription(@Body() upgradeData: UpgradeSubscriptionDto) {
    return await this.subscriptionService.upgradeSubscription(upgradeData);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('find/all/:id')
  async fetchAllSubscriptions(@Param('id') id: string) {
    return this.subscriptionService.findAllById(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('latest/:id')
  async latestSubscription(@Param('id') id: string) {
    return this.subscriptionService.findLatest(id);
  }
}
