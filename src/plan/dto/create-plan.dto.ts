import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min, MaxLength } from 'class-validator';

export class CreatePlanDto {
  @ApiProperty({
    example: 'Basic',
    description: 'Plan name (must be unique)',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({
    example: 2,
    description: 'Maximum number of user profiles allowed',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @IsNotEmpty({ message: 'maxUser is required' })
  maxUsers: number;

  @ApiProperty({
    example: 10,
    description: '-1 means unlimited watchlist items',
  })
  @IsInt()
  @Min(-1)
  @IsNotEmpty({ message: 'maxWatchlist is required' })
  maxWatchlist: number;

  @ApiProperty({
    example: 199,
    description: 'Price in INR',
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  @IsNotEmpty({ message: 'price is required' })
  price: number;

  @ApiProperty({
    description: 'Maximum streaming quality allowed for the plan',
    example: '4K',
  })
  @IsString({ message: 'maxQuality must be a string' })
  @IsNotEmpty({ message: 'maxQuality is required' })
  maxQuality: string;

  @ApiProperty({
    description: 'Subscription duration (e.g. 30d, 90d, 1y)',
    example: '30d',
  })
  @IsString({ message: 'duration must be a string' })
  @IsNotEmpty({ message: 'duration is required' })
  duration: string;
}
