import { sendMessage } from './utils.js';
import { existsSync } from 'fs';

/**
 * Interface for the transcribe video response
 */
export interface TranscribeVideoFileResponse {
  transcribe_audio?: {
    text: string;
    chunks: Array<{
      text: string;
      start: number;
      end: number;
    }>;
    error?: string;
  };
  transcribe_video?: Array<{
    text: string;
    start: number;
    end: number;
    error?: string;
  }> | {
    error: string;
  };
}

/**
 * Interface for the transcribe video response
 */
export interface TranscribeVideoResponse {
  data: (TranscribeVideoFileResponse & {
    info?: {
      uploader?: string;
      duration?: number;
      view_count?: number;
      like_count?: number;
      dislike_count?: number;
      repost_count?: number;
      average_rating?: number;
      comment_count?: number;
      age_limit?: number;
      fulltitle?: string;
      tags?: string[];
      categories?: string[];
      description?: string;
      file?: string;
      error?: string;
    }
  })[];
}

/**
 * Interface for the transcribe image response
 */
export interface TranscribeImageResponse {
  transcribe_img: {
    text: string;
    error?: string;
  };
}

/**
 * Transcribe a video from a URL
 * 
 * @param url - URL of the video to transcribe
 * @returns Object containing the transcription results
 */
export async function transcribeVideo(url: string[]): Promise<any> {
  try {
    // Validate the URL
    if (!url) {
      throw new Error('URL is required');
    }

    // Prepare the request payload for video transcription
    const message = {
      type: 'video',  // This tells the server it's a video transcription request
      v_conv: true,   // Mark as a pipeline task
      urls: url     // The server expects an array of URLs
    };
    
    // Send the request to the Optivus server
    const { data }: TranscribeVideoResponse = await sendMessage(message);
    
    // Process the response
    if (data && Array.isArray(data)) {
      let response = '';
      for (const k in data) {
        if (data[k].info?.error) {
            continue;
        }
        response += `Video ${Number(k)+1}:\n`;
        if (data[k].info) {
            for (const key in data[k].info) {
              if (key === 'file') {
                continue;
              }
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
              const value = (data[k].info as any)[key];
              if (value) {
                response += `${key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}: `
                if (Array.isArray(value) && value.length > 0) {
                  if (key === 'tags') {
                    response += `#${value.join(', #')}\n`;
                  } else {
                    response += `${value.join(', ')}\n`;
                  }
                } else {
                    response += `${value}\n`;
                }
              }
            }
        }
        response += `Transcription:\n`;
        if (data[k].transcribe_video && Array.isArray(data[k].transcribe_video)) {
          response += `Video frames:\n`;
          for (const chunk of data[k].transcribe_video) {
            if (chunk.error) {
                continue;
            } else {
                response += `${chunk.start} second: ${chunk.text.replace(/\n/g, ' ')}\n`;
            }
          }
        }
        if (data[k].transcribe_audio && (data[k].transcribe_audio as { text: string }).text) {
          response += `Audio:\n`;
          response += `${(data[k].transcribe_audio as { text: string }).text.replace(/\n/g, ' ')}\n`;
        }
        response += `\n`;
      }
      return response;
    } else {
      throw new Error('Invalid transcription');
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Transcribe video failed');
  }
}

/**
 * Transcribe a video from a local file
 * 
 * @param filePath - Path to the video file to transcribe
 * @returns Object containing the transcription results
 */
export async function transcribeVideoFile(filePath: string): Promise<any> {
  try {
    // Validate the file path
    if (!filePath) {
      throw new Error('File path is required');
    }

    // Check if the file exists
    if (!existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Prepare the request payload for video file transcription
    const message = {
      type: 'video',  // This tells the server it's a video transcription request
      v_conv: true,   // Mark as a pipeline task
      file: filePath  // The server expects a file path
    };
    
    // Send the request to the Optivus server
    const { data } = await sendMessage(message);
    
    // Process the response
    if (data && Array.isArray(data)) {
      const result: TranscribeVideoFileResponse = data[0]; // Get the first result since we only sent one file
      
      let response = 'Transcription video:\n';
      if (result.transcribe_video && Array.isArray(result.transcribe_video)) {
        for (const chunk of result.transcribe_video) {
          if (chunk.error) {
            continue;
          } else {
            response += `Frame ${chunk.start} second: ${chunk.text.replace(/\n/g, ' ')}\n`;
          }
        }
      } else if (result.transcribe_video && (result.transcribe_video as { error: string }).error) {
        response += `Error: ${(result.transcribe_video as { error: string }).error}\n`;
      }
      response += 'Transcription audio:\n';
      if (result.transcribe_audio && (result.transcribe_audio as { text: string }).text) {
        response += `${(result.transcribe_audio as { text: string }).text}\n`;
      } else if (result.transcribe_audio && (result.transcribe_audio as { error: string }).error) {
        response += `Error: ${(result.transcribe_audio as { error: string }).error}\n`;
      }
      return response;
    } else {
      throw new Error('Invalid transcription response');
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Transcribe video file failed');
  }
}

/**
 * Transcribe an image from a local file
 * 
 * @param filePath - Path to the image file to transcribe
 * @returns Object containing the transcription results
 */
export async function transcribeImage(filePath: string): Promise<any> {
  try {
    // Validate the file path
    if (!filePath) {
      throw new Error('File path is required');
    }

    // Check if the file exists
    if (!existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Prepare the request payload for image transcription
    const message = {
      type: 'flrnc',  // This tells the server it's a Florence image transcription request
      file: filePath  // The server expects a file path
    };
    
    // Send the request to the Optivus server
    const response = await sendMessage(message);
    
    // Process the response
    if (response && response.transcribe_img) {
      return `Image description: ${response.transcribe_img.text.replace(/\n/g, ' ')}`;
    } else if (response && (response.transcribe_img as { error: string }).error) {
      throw new Error(`Image description error: ${(response.transcribe_img as { error: string }).error}`);
    } else {
      throw new Error('Invalid transcription response');
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Transcribe image failed');
  }
}
