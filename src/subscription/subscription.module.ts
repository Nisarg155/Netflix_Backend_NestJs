import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  imports: [AuthModule],
})
export class SubscriptionModule {}
