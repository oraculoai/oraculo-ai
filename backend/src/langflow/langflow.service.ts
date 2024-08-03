import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class LangflowService {
  private readonly LANGFLOW_API_URL = 'http://127.0.0.1:7860/api/v1';

  private readonly flow1 = 'bce6184d-cad5-49ec-abd2-345773ef6670';

  async uploadFiles(): Promise<AxiosResponse<any>> {
    const response = await axios.post(
      this.LANGFLOW_API_URL + '/run/' + this.flow1,
      {
        input_value: 'message',
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
