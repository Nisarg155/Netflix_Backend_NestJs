import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BuySubscriptionDto {
  @ApiProperty({
    description: 'User ID who is purchasing the subscription',
    example: 'b7a1f9e2-7c3a-4a44-9a77-9cddf3b7e111',
  })
  @IsNotEmpty({ message: "UserId can't be empty" })
  @IsUUID('4', { message: 'UserId must be a valid UUID' })
  userId: string;

  @ApiProperty({
    description: 'Plan ID to subscribe',
    example: 'a2c4d8e9-5f11-4c4a-8d02-2d8fa1112222',
  })
  @IsNotEmpty({ message: "Plan Id can't be empty" })
  @IsUUID('4', { message: 'Plan id must be a valid UUID' })
  planId: string;

  @ApiProperty({
    description: 'Subscription start date (ISO format)',
    example: '2025-01-10',
  })
  @IsNotEmpty({ message: "Start Date can't be empty" })
  @IsDateString({}, { message: 'Must be valid date string' })
  startDate: string;
}
