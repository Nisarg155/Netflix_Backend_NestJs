import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [PlanController],
  providers: [PlanService],
  imports: [AuthModule],
})
export class PlanModule {}
