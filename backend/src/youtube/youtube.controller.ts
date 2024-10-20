import { Controller, Get, Param } from '@nestjs/common';
import { YoutubeService } from '@/youtube/youtube.service';
import { TranscriptResponse } from 'youtube-transcript';

@Controller('youtube')
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  /**
   * Get the transcript of a YouTube video.
   * @param {string} videoIdOrUrl - The ID or URL of the YouTube video.
   * @returns {Promise<TranscriptResponse[]>} The transcript of the YouTube video.
   */
  @Get(':videoIdOrUrl/transcript')
  getVideoTranscript(
    @Param('videoIdOrUrl') videoIdOrUrl: string,
  ): Promise<TranscriptResponse[]> {
    return this.youtubeService.getVideoTranscript(videoIdOrUrl);
  }
}
