import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class UpdatePlanDto {
  @ApiProperty({
    example: 'c1f9c8e0-1234-4567-890a-acde12345678',
  })
  @IsString()
  @IsNotEmpty({ message: 'Id is required' })
  planId: string;

  @ApiProperty({
    example: 'Basic',
    description: 'Plan name (must be unique)',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name?: string;

  @ApiProperty({
    example: 2,
    description: 'Maximum number of user profiles allowed',
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxUsers?: number;

  @ApiProperty({
    example: 10,
    description: '-1 means unlimited watchlist items',
  })
  @IsOptional()
  @IsInt()
  @Min(-1)
  maxWatchlist?: number;

  @ApiProperty({
    example: 199,
    description: 'Price in INR',
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  price?: number;
}
