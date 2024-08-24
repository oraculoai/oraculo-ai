import { ApiEndpointsType } from '@/src/app/api/api.types';

export const ApiConstants = {
  baseURL: 'http://localhost:3333',
  endpoints: ApiEndpointsType()({
    ai: {
      post: {
        documentQa: () => '/ai/document-qa',
        sendMessage: () => '/ai/message',
      },
    },
  }),
};
