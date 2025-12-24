import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class WatchlistAddOperationsDto {
  @ApiProperty({
    description: 'Content ID to add/remove from watchlist',
    example: 'c2b5c8e4-8f5b-4d5c-9c2b-1e2a3b4c5d6e',
  })
  @IsNotEmpty({ message: "ContentId Can't be empty" })
  @IsUUID('4', { message: 'Content Id must be valid UUID' })
  contentId: string;

  @ApiProperty({
    description: 'User ID performing the watchlist operation',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsNotEmpty({ message: "UserId Can't be empty" })
  @IsUUID('4', { message: 'UserId must be valid UUID' })
  userId: string;
}
