import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LangflowService {
  async runFlow(flowId: string, inputData: any): Promise<any> {
    try {
      const response = await axios.post(
        `${process.env.LANGFLOW_API_URL}/run/${flowId}`,
        {
          session_id: Math.random().toString(36).substring(7),
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
