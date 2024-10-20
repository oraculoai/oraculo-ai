import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { TranscriptResponse, YoutubeTranscript } from 'youtube-transcript';

@Injectable()
export class YoutubeService {
  /**
   * Get the transcript of a YouTube video.
   * @param {string} videoIdOrUrl - The ID or URL of the YouTube video.
   * @returns {Promise<TranscriptResponse[]>} The transcript of the YouTube video.
   */
  fetchVideoTranscript(videoIdOrUrl: string): Promise<TranscriptResponse[]> {
    try {
      if (videoIdOrUrl.startsWith('https://www.youtube.com/live/')) {
        videoIdOrUrl = videoIdOrUrl.replace(
          'https://www.youtube.com/live/',
          'https://www.youtube.com/watch?v=',
        );
      }

      return YoutubeTranscript.fetchTranscript(videoIdOrUrl);
    } catch (e) {
      Logger.error('Failed to fetch the transcript of the YouTube video.', e);

      throw new InternalServerErrorException(
        'Failed to fetch the transcript of the YouTube video.',
      );
    }
  }
}
