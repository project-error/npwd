import { useQuery } from '@tanstack/react-query';
import { instance } from '../../utils/fetch';
import { Message } from '../../../../shared/Types';
import { StringifyDates } from '../../../../shared/TypeUtils';

export const useConversationMessages = (phoneNumber?: string) => {
  const { data } = useQuery({
    queryKey: ['conversation', phoneNumber],
    queryFn: async () => {
      if (!phoneNumber) {
        return { payload: [] };
      }

      const { data } = await instance.post<{ payload: StringifyDates<Message>[] }>(
        `/conversations/${phoneNumber}`,
      );
      return data;
    },
  });

  return data?.payload || [];
};
