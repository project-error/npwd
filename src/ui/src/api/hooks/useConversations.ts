import { useQuery } from '@tanstack/react-query';
import { instance } from '../../utils/fetch';

export const useConversations = () => {
  const { data } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data } = await instance.post<{ payload: string[] }>('/conversations');
      return data;
    },
  });

  return data?.payload || [];
};
