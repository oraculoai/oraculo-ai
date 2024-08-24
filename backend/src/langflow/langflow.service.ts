import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class LangflowService {
  private readonly LANGFLOW_API_URL = 'http://127.0.0.1:7860/api/v1';

  private readonly flow1 = '4c635199-0155-4ce3-8214-d442f9612134';

  async runFlow1(input: string): Promise<any> {
    const response = await axios.post(
      this.LANGFLOW_API_URL + '/run/' + this.flow1,
      {
        input_value: input,
        output_type: 'chat',
        input_type: 'chat',
        tweaks: {
          'ChatInput-Dgmil': {},
          'Prompt-OcpPR': {},
          'ChatOutput-gbOfQ': {},
          'OpenAIModel-bR0Zb': {},
        },
      },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    return response.data;
  }
}
