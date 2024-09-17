import { useApps } from '@/contexts/AppsContext/useApps';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePrevious } from '@/hooks/usePrevious';
import { Button } from '@/components/ui/button';

export const HomeView = () => {
  const [isEditing, setIsEditing] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const apps = useApps();

  const prevAppLen = usePrevious(apps.length);

  /**
   * Check if user is holding long click
   */
  const handleMouseDown = () => {
    timeoutRef.current = setTimeout(() => {
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

  if (!apps.length) {
    return null;
  }

  return (
    <main
      className="p-8 flex flex-col gap-2 flex-1 select-none"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {isEditing && <span onClick={() => setIsEditing(false)}>Editing ..</span>}

      <div className="grid grid-cols-4 gap-4">
        {apps.map((app, index) => (
          <motion.div
            key={app.id}
            animate={prevAppLen === 0 ? 'animation' : 'exists'}
            initial={
              prevAppLen === 0 && {
                scale: 0,
                opacity: 0,
              }
            }
            variants={{
              animation: {
                scale: 1,
                opacity: 1,
                transition: {
                  delay: index * 0.1,
                },
              },
              exists: {
                scale: 1,
                opacity: 1,
              },
            }}
            whileHover={{
              scale: 0.9,
            }}
            drag={isEditing}
          >
            <Link key={app.id} to={`/apps/${app.path.replace('/', '')}`} draggable={!isEditing}>
              <div className="flex items-center gap-4 p-2 bg-secondary text-secondary rounded-lg w-full h-16 text-4xl">
                {app.Icon}
              </div>
            </Link>
          </motion.div>
        ))}

        <div className="col-span-2 row-span-2 bg-secondary flex flex-1 rounded-lg w-full p-4 min-h-32">
          Widget example
        </div>

        <div className="col-span-2 row-span-2 bg-secondary flex flex-1 rounded-lg w-full p-4 min-h-32">
          <Button>Add</Button>
        </div>

        <div className="col-span-4 row-span-2 bg-secondary flex flex-1 rounded-lg w-full p-4 min-h-32">
          <Button>Add notification</Button>
        </div>

        {/* {apps.map((app) => (
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
        )} */}
      </div>
    </main>
  );
};
