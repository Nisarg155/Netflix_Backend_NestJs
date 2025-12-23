import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class BuySubscriptionDto {
  @IsNotEmpty({ message: 'User id is required' })
  @IsString({ message: 'User id should be a string' })
  userId: string;

  @IsNotEmpty({ message: 'plan id is required' })
  @IsString({ message: 'Plan id should be a string' })
  planId: string;

  @IsNotEmpty({ message: 'Start date is required' })
  @IsDateString({}, { message: 'Must be valid date string' })
  startDate: Date;

  @IsNotEmpty({ message: 'End date is required' })
  @IsDateString({}, { message: 'Must be valid date string' })
  endDate: Date;
}
