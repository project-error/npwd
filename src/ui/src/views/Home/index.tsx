import { Link } from 'react-router-dom';

/** List of apps */
const apps = [
  {
    id: 'calls',
    name: 'Calls',
    logo: '📞',
  },
  {
    id: 'contacts',
    name: 'Contacts',
    logo: '📇',
  },
  {
    id: 'messages',
    name: 'Messages',
    logo: '💬',
  },
  {
    id: 'email',
    name: 'Email',
    logo: '📧',
  },
  {
    id: 'photos',
    name: 'Photos',
    logo: '📷',
  },
  {
    id: 'camera',
    name: 'Camera',
    logo: '📸',
  },
  {
    id: 'weather',
    name: 'Weather',
    logo: '🌤️',
  },
  {
    id: 'maps',
    name: 'Maps',
    logo: '🗺️',
  },
  {
    id: 'clock',
    name: 'Clock',
    logo: '⏰',
  },
  {
    id: 'calendar',
    name: 'Calendar',
    logo: '📅',
  },
  {
    id: 'notes',
    name: 'Notes',
    logo: '📝',
  },
  {
    id: 'settings',
    name: 'Settings',
    logo: '⚙️',
  },
];

export const HomeView = () => {
  return (
    <main className="p-8 flex flex-col gap-2">
      <div className="grid grid-cols-4 gap-4">
        {apps.map((app) => (
          <Link to={`/apps/${app.id}`} key={app.id}>
            <div className="flex items-center gap-4 p-2 bg-secondary text-secondary rounded-lg">
              <span className="text-4xl">{app.logo}</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
};
