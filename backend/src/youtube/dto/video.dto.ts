import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VideoDto {
  /**
   * Supports:
   *   'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
   *   'dQw4w9WgXcQ',
   *   'https://www.youtube.com/live/dQw4w9WgXcQ',
   *   'https://youtu.be/dQw4w9WgXcQ',
   */
  @IsString()
  @ApiProperty({
    description: 'The ID or URL of the YouTube video.',
    example: 'dQw4w9WgXcQ',
  })
  videoIdOrUrl: string;
}
