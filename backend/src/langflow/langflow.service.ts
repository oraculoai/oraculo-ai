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
        session_id: 'session1',
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

  private readonly localMemoryBotFlowId =
    '1eb27dfa-c650-4009-b2dd-fa929967e876';

  async runLocalMemoryBot(sessionId: string, input: string): Promise<any> {
    const response = await axios.post(
      this.LANGFLOW_API_URL + '/run/' + this.localMemoryBotFlowId,
      {
        session_id: sessionId,
        input_value: input,
        output_type: 'chat',
        input_type: 'chat',
        tweaks: {
          // 'Prompt-jhhd3': {
          //   context: '',
          //   template: '{context}\n\nUser: {user_message}\nAI: ',
          //   user_message: '',
          // },
          // 'ChatInput-7jgiF': {
          //   files: '',
          //   input_value: '',
          //   sender: 'User',
          //   sender_name: 'User',
          //   session_id: '',
          //   should_store_message: true,
          // },
          // 'OpenAIModel-0v938': {
          //   api_key: 'OPENAI_API_KEY',
          //   input_value: '',
          //   json_mode: false,
          //   max_tokens: null,
          //   model_kwargs: {},
          //   model_name: 'gpt-4o-mini',
          //   openai_api_base: '',
          //   output_schema: {},
          //   seed: 1,
          //   stream: false,
          //   system_message: '',
          //   temperature: 0.1,
          // },
          // 'ChatOutput-8cnrB': {
          //   data_template: '{text}',
          //   input_value: '',
          //   sender: 'Machine',
          //   sender_name: 'AI',
          //   session_id: '',
          //   should_store_message: true,
          // },
          // 'Memory-0qYgc': {
          //   n_messages: 100,
          //   order: 'Ascending',
          //   sender: 'Machine and User',
          //   sender_name: '',
          //   session_id: '',
          //   template: '{sender_name}: {text}',
          // },
        },
      },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    return response.data;
  }
}
