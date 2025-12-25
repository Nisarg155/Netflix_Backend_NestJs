import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRatingDto {
  @ApiProperty({
    description: 'rating ID of the rating',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty({ message: 'ratingId must not be empty' })
  @IsUUID('4', { message: 'ratingId must be valid UUID' })
  ratingId: string;

  @ApiProperty({
    description: 'Rating value (0–10)',
    example: 8,
    minimum: 0,
    maximum: 10,
  })
  @IsOptional()
  @IsNotEmpty({ message: 'Rating must not be empty' })
  @IsInt({ message: 'Rating must be an integer' })
  @Min(0, { message: 'Rating must be positive integer' })
  @Max(10, { message: 'Rating cannot exceed 10' })
  rating?: number;

  @ApiPropertyOptional({
    description: 'Optional review comment',
    example: 'Great content, well explained!',
  })
  @IsOptional()
  comment?: string;
}
