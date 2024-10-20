import { Body, Controller, Post } from '@nestjs/common';
import { YoutubeService } from '@/youtube/youtube.service';
import { TranscriptResponse } from 'youtube-transcript';
import { VideoDto } from '@/youtube/dto/video.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('youtube')
@Controller('youtube')
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  /**
   * Get the transcript of a YouTube video.
   * @param {VideoDto} dto - Object containing the ID or URL of the YouTube video.
   * @returns {Promise<TranscriptResponse[]>} The transcript of the YouTube video.
   */
  @Post('/transcript')
  fetchVideoTranscript(@Body() dto: VideoDto): Promise<TranscriptResponse[]> {
    return this.youtubeService.fetchVideoTranscript(dto.videoIdOrUrl);
  }
}
