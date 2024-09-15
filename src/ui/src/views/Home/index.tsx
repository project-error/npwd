import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/** List of apps */
const apps = [
  {
    id: 'calls',
    name: 'Calls',
    logo: '📞',
  },
  {
    id: 'casino',
    name: 'Casino',
    logo: '🎰',
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
  const [isEditing, setIsEditing] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  /**
   * Check if user is holding long click
   */
  const handleMouseDown = () => {
    console.log('mouse down');
    timeoutRef.current = setTimeout(() => {
      console.log('editing mode');
      setIsEditing(true);
    }, 1000);
  };

  /**
   * Reset editing state
   */
  const handleMouseUp = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  return (
    <main
      className="p-8 flex flex-col gap-2 flex-1 select-none"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {isEditing && <span onClick={() => setIsEditing(false)}>Editing ..</span>}
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
