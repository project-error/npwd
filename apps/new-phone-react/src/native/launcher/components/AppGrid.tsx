import { useApps } from '@system/hooks/useApps';
import { Link } from 'react-router';

export const AppGrid = () => {
  const apps = useApps();

  return (
    <div className="grid grid-cols-4 gap-6 p-6">
      {apps.map((app) => (
        <Link
          to={app.path}
          key={app.path}
          className="p-6 bg-gray-300 rounded-xl flex items-center justify-center"
        >
          <h2>{app.name[0]}</h2>
        </Link>
      ))}
    </div>
  );
};
