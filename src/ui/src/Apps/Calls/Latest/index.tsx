import { useNavigate, useSearchParams } from 'react-router-dom';
import { TopNavigation } from '../../../components/Navigation/TopNavigation';

export const LatestView = () => {
  return (
    <div className="flex flex-col gap-2">
      <TopNavigation title="Latest" />
      <span>Latest goes here</span>
    </div>
  );
};
