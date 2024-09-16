import { useQuery } from '@tanstack/react-query';
import { instance } from '../../utils/fetch';
import { Message } from '../../../../shared/Types';
import { StringifyDates } from '../../../../shared/TypeUtils';
import { useBroadcastEvent } from '@/hooks/useBroadcastEvent';
import { queryClient } from '@/Providers';

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

  useBroadcastEvent('message:new-message', (data) => {
    console.log('new message', { data });
    queryClient.invalidateQueries({
      queryKey: ['conversation', phoneNumber],
    });
  });

  return data?.payload || [];
};
