import { useExternalApps } from '@/hooks/useExternalApps';
import { createElement, useRef, useState } from 'react';
import { Link, Router } from 'react-router-dom';

/** List of apps */
const apps = [
  {
    id: 'calls',
    name: 'Calls',
    Icon: '📞',
  },
  {
    id: 'casino',
    name: 'Casino',
    Icon: '🎰',
  },
  {
    id: 'messages',
    name: 'Messages',
    Icon: '💬',
  },
  {
    id: 'email',
    name: 'Email',
    Icon: '📧',
  },
  {
    id: 'photos',
    name: 'Photos',
    Icon: '📷',
  },
  {
    id: 'camera',
    name: 'Camera',
    Icon: '📸',
  },
  {
    id: 'clock',
    name: 'Clock',
    Icon: '⏰',
  },
  {
    id: 'calendar',
    name: 'Calendar',
    Icon: '📅',
  },
  {
    id: 'notes',
    name: 'Notes',
    Icon: '📝',
  },
  {
    id: 'settings',
    name: 'Settings',
    Icon: '⚙️',
  },
];

export const HomeView = () => {
  const [isEditing, setIsEditing] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const externalApps = useExternalApps();

  console.log({ externalApps });

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

  const FirstExternalApp = externalApps[0];
  const Component = FirstExternalApp?.Component;

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
            <div className="flex items-center gap-4 p-2 bg-secondary text-secondary rounded-lg w-16 h-16 text-4xl">
              {app.Icon}
            </div>
          </Link>
        ))}

        {externalApps.map((app) =>
          app ? (
            <Link to={`/apps${app.path}/home`} key={app.id}>
              <div className="flex items-center gap-4 p-2 bg-secondary text-secondary rounded-lg w-16 h-16 ">
                {app.Icon}
              </div>
            </Link>
          ) : null,
        )}
      </div>
    </main>
  );
};
