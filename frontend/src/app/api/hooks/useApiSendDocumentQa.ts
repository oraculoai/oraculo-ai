import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { DocumentQaDto } from '@/src/app/_model/document-qa.dto';
import axios, { AxiosError } from 'axios';
import { MessageDomain } from '@/src/app/_model/message.domain';
import { ApiConstants } from '@/src/app/api/api.constants';

export default function useApiSendDocumentQa(
  options: UseMutationOptions<MessageDomain, AxiosError, DocumentQaDto>,
) {
  return useMutation({
    ...options,
    mutationFn: async (dto: DocumentQaDto) => {
      const response = await axios.post<MessageDomain>(
        ApiConstants.endpoints.ai.post.documentQa(),
        dto,
      );

      return response.data;
    },
  });
}
