import { TopNavigation } from '../../../components/Navigation/TopNavigation';
import { useQuery } from '@tanstack/react-query';
import { getMyCalls } from '../../../api/device';
import { CallsListItem } from '../../../components/Call/CallsListItem';

export const LatestView = () => {
  const { data } = useQuery({
    initialData: null,
    queryKey: ['my-calls'],
    queryFn: getMyCalls,
  });

  return (
    <div className="flex flex-col gap-2">
      <TopNavigation title="Latest" />
      <span>Latest goes here</span>

      <ul className="p-2 flex flex-col gap-1">
        {data?.payload.map((call) => (
          <CallsListItem key={call.id} call={call} />
        ))}
      </ul>
    </div>
  );
};
