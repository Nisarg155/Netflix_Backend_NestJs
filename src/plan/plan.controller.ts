import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { UserAuthGuard } from '../auth/guards/user-auth-guard.service';

@ApiTags('Plan')
@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPlanDto: CreatePlanDto) {
    return await this.planService.create(createPlanDto);
  }

  @Put('update')
  @HttpCode(HttpStatus.OK)
  async update(@Body() updatePlanDto: UpdatePlanDto) {
    return await this.planService.update(updatePlanDto);
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(UserAuthGuard)
  @Get('all')
  @HttpCode(HttpStatus.OK)
  async getAll() {
    return this.planService.findAll();
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(UserAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('id') id: string) {
    return await this.planService.findOne(id);
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    return await this.planService.delete(id);
  }
}
