import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { MessageDomain } from '@/src/app/_model/message.domain';
import { ApiConstants } from '@/src/app/api/api.constants';
import { MessageDto } from '@/src/app/_model/message.dto';
import api from '@/src/app/api/api';

export default function useApiSendMessage(
  options: UseMutationOptions<MessageDomain, AxiosError, MessageDto>,
): UseMutationResult<MessageDomain, AxiosError, MessageDto> {
  return useMutation({
    ...options,
    mutationFn: async (dto: MessageDto) => {
      const response = await api.post<MessageDomain>(
        ApiConstants.endpoints.ai.post.sendMessage(),
        dto,
      );

      return response.data;
    },
  });
}
