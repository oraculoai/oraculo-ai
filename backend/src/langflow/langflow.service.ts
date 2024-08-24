import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class LangflowService {
  private readonly LANGFLOW_API_URL = 'http://127.0.0.1:7860/api/v1';

  private readonly memoryChatBot = 'b30909b7-2f55-432d-89b6-3d7ffae575a1';

  async runMemoryChatBot(input: string): Promise<any> {
    const response = await axios.post(
      this.LANGFLOW_API_URL + '/run/' + this.memoryChatBot,
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

  private readonly documentQaFlowId = 'bd8e657d-5bf7-4056-be47-44bf0066e3b9';

  async documentQa(input: string, filePath: string): Promise<any> {
    const response = await axios.post(
      this.LANGFLOW_API_URL + '/run/' + this.documentQaFlowId,
      {
        input_value: input,
        output_type: 'chat',
        input_type: 'chat',
        tweaks: {
          'Prompt-gLKoS': {},
          'ChatInput-K8PGB': {},
          'ChatOutput-UTNCZ': {},
          'OpenAIModel-5z85e': {},
          'ParseData-8BgqK': {},
          'File-EQjD8': {
            path: filePath,
          },
        },
      },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    return response.data;
  }
}
