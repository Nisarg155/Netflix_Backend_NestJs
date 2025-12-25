import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddRatingDto {
  @ApiProperty({
    description: 'User ID who is giving the rating',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty({ message: 'UserId must not be empty' })
  @IsUUID('4', { message: 'UserId must be valid UUID' })
  userId: string;

  @ApiProperty({
    description: 'Content ID being rated',
    example: '660e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty({ message: 'ContentId must not be empty' })
  @IsUUID('4', { message: 'ContentId must be valid UUID' })
  contentId: string;

  @ApiProperty({
    description: 'Rating value (0–10)',
    example: 8,
    minimum: 0,
    maximum: 10,
  })
  @IsNotEmpty({ message: 'Rating must not be empty' })
  @IsInt({ message: 'Rating must be an integer' })
  @Min(0, { message: 'Rating must be positive integer' })
  @Max(10, { message: 'Rating cannot exceed 10' })
  rating: number;

  @ApiPropertyOptional({
    description: 'Optional review comment',
    example: 'Great content, well explained!',
  })
  @IsOptional()
  comment?: string;
}
