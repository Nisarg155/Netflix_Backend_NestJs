import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  MaxLength,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class UpdatePlanDto {
  @ApiProperty({
    example: 'c1f9c8e0-1234-4567-890a-acde12345678',
  })
  @IsUUID('4', { message: 'Must be Valid Uuid ' })
  @IsNotEmpty({ message: 'Id is required' })
  planId: string;

  @ApiProperty({
    example: 'Basic',
    description: 'Plan name (must be unique)',
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: "Name Can't be empty" })
  @MaxLength(50, { message: 'Must not longer than 50 characters' })
  name?: string;

  @ApiProperty({
    example: 2,
    description: 'Maximum number of user profiles allowed',
    minimum: 1,
  })
  @IsOptional()
  @IsInt({ message: 'Maximum users must be valid Int' })
  @Min(1, { message: 'Minimum 1 user must be there ' })
  maxUsers?: number;

  @ApiProperty({
    example: 10,
    description: '-1 means unlimited watchlist items',
  })
  @IsOptional()
  @IsInt({ message: 'Maximum Watchlist must be integer' })
  @Min(-1)
  maxWatchlist?: number;

  @ApiProperty({
    example: 199,
    description: 'Price in INR',
    minimum: 0,
  })
  @IsOptional()
  @IsInt({ message: 'Price must be integer' })
  @Min(0, { message: 'Price must be a positive integer ' })
  price?: number;

  @ApiProperty({
    description: 'Maximum streaming quality allowed for the plan',
    example: '4K',
  })
  @IsString({ message: 'maxQuality must be a string' })
  @IsNotEmpty({ message: "Quality Can't be empty" })
  @IsOptional()
  maxQuality?: string;

  @ApiProperty({
    description: 'Subscription duration (e.g. 30d, 90d, 1y)',
    example: '30d',
  })
  @IsString({ message: 'duration must be a string' })
  @IsNotEmpty({ message: "Duration Can't be empty " })
  @IsOptional()
  duration?: string;
}
