import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class WatchlistRemoveOperationsDto {
  @ApiProperty({
    description: 'Watchlist ID to add from watchlist',
    example: 'c2b5c8e4-8f5b-4d5c-9c2b-1e2a3b4c5d6e',
  })
  @IsNotEmpty({ message: "WatchlistId Can't be empty" })
  @IsUUID('4', { message: 'Watchlist Id must be valid UUID' })
  watchlistId: string;

  @ApiProperty({
    description: 'User ID performing the watchlist operation',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsNotEmpty({ message: "UserId Can't be empty" })
  @IsUUID('4', { message: 'UserId must be valid UUID' })
  userId: string;
}
