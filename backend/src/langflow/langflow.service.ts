import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LangflowService {
  async runFlow(
    flowIdOrSlug: string,
    inputData: any,
    sessionId?: string,
  ): Promise<any> {
    try {
      const response = await axios.post(
        `${process.env.LANGFLOW_API_URL}/run/${flowIdOrSlug}`,
        {
          session_id: sessionId,
          input_value: JSON.stringify(inputData),
          output_type: 'chat',
          input_type: 'chat',
        },
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );
      return response.data || { message: 'No response from Langflow' };
    } catch (error: any) {
      throw new Error(`Langflow processing failed: ${error.message}`);
    }
  }
}
