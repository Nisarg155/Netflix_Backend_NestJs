import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpgradeSubscriptionDto {
  @ApiProperty({
    description: 'Subscription ID to upgrade',
    example: 'b3b2c7a1-9f4d-4c12-9a91-1f2a6b8d4c33',
  })
  @IsNotEmpty({ message: "Subscription Id can't be empty" })
  @IsUUID('4', { message: 'Subscription Id must be valid UUID' })
  subId: string;

  @ApiProperty({
    description: 'New plan ID for upgrade',
    example: 'd2f5c1e4-7a9b-4c91-9c12-3f5b6a7d8e90',
  })
  @IsNotEmpty({ message: "Plan Id can't be empty" })
  @IsUUID('4', { message: 'Plan Id must be valid UUID' })
  planId: string;

  @ApiProperty({
    description: 'User ID who owns the subscription',
    example: 'a8b7c6d5-4e3f-2a1b-9c8d-7e6f5a4b3c21',
  })
  @IsNotEmpty({ message: "User Id can't be empty" })
  @IsUUID('4', { message: 'User Id must be valid UUID' })
  userId: string;
}
