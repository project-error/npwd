import { Button } from '@/components/ui/button';
import { useApps } from '@/contexts/AppsContext/useApps';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  const apps = useApps();

  if (!apps.length) {
    return <span>loading ..</span>;
  }

  return (
    <div>
      <h1>Not Found</h1>
      <div className="p-8 text-primary h-full w-full flex flex-col gap-8">
        <span>Not Found</span>
        <span>🤷</span>

        <Link to="/home">
          <Button className="border px-4 py-2 rounded-sm">Go home</Button>
        </Link>
      </div>
    </div>
  );
};
