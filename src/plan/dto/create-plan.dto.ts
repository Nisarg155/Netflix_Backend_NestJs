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
  name: string;

  @ApiProperty({
    example: 2,
    description: 'Maximum number of user profiles allowed',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  maxUsers: number;

  @ApiProperty({
    example: 10,
    description: '-1 means unlimited watchlist items',
  })
  @IsInt()
  @Min(-1)
  maxWatchlist: number;

  @ApiProperty({
    example: 199,
    description: 'Price in INR',
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  price: number;
}
