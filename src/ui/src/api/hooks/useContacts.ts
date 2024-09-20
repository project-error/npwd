import { useQuery } from '@tanstack/react-query';
import { getContacts } from '../contacts';
import { queryClient } from '../../Providers';
import { Contact } from '../../../../shared/Types';

export const useContacts = (): [Contact[], () => void, boolean] => {
  const { data, isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: getContacts,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ['contacts'],
    });
  };

  return [data?.payload || [], invalidate, isLoading];
};
