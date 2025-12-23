import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class PlanService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(planeData: CreatePlanDto) {
    if (planeData.maxWatchlist === 0) {
      throw new HttpException(
        'Cant Set maxWatchlist as 0',
        HttpStatus.BAD_REQUEST,
      );
    }

    const plan = await this.prismaService.plan.create({
      data: planeData,
    });

    return {
      message: 'New Plan Created',
      data: plan,
    };
  }

  async update(updateData: UpdatePlanDto) {
    if (updateData?.maxWatchlist === 0) {
      throw new HttpException(
        'Cant Set maxWatchlist as 0',
        HttpStatus.BAD_REQUEST,
      );
    }

    const existingPlan = await this.prismaService.plan.findUnique({
      where: { planId: updateData.planId },
    });

    if (!existingPlan) {
      throw new NotFoundException('Plan not found');
    }

    const plan = await this.prismaService.plan.update({
      where: { planId: updateData.planId },
      data: updateData,
    });

    return {
      message: 'Plan Updated Successfully',
      data: plan,
    };
  }

  async findAll() {
    return this.prismaService.plan.findMany();
  }

  async findOne(id: string) {
    const plan = await this.prismaService.plan.findUnique({
      where: { planId: id },
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }
    return plan;
  }

  async delete(id: string) {
    const plan = await this.prismaService.plan.findUnique({
      where: { planId: id },
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    await this.prismaService.plan.delete({
      where: { planId: id },
    });

    return {
      message: 'Plan Deleted Successfully',
    };
  }
}
