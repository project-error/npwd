import { Link } from 'react-router-dom';
import { useSettings } from '@/api/hooks/useSettings';
import { Slider } from '@/components/ui/slider';
import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

export const SettingsApp = () => {
  const { settings, update } = useSettings();
  const [scale, setScale] = useState(settings?.scale || 100);

  const toggleTheme = () => {
    update({
      theme: settings?.theme === 'dark' ? 'light' : 'dark',
    });
  };

  const debouncedScale = useDebounce(scale || 100, 450);

  useEffect(() => {
    console.log({ debouncedScale });
    update({
      scale: debouncedScale,
    });
  }, [debouncedScale]);

  return (
    <div className="p-8 h-full w-full bg-primary text-primary flex flex-col gap-8">
      <span>Settings</span>
      <span className="text-3xl animate-pulse">⚙️</span>

      <button onClick={toggleTheme}>toggle theme</button>

      <span>Set phone scale</span>
      <Slider
        defaultValue={[scale]}
        max={100}
        min={40}
        step={1}
        onValueChange={(value) => {
          // handleUpdateScale(value[0]);
          setScale(value[0]);
        }}
        onChange={(event) => {
          console.log(event);
        }}
      />

      <Link to="/home">
        <button className="border px-4 py-2 rounded-sm">
          <span>Go Home</span>
        </button>
      </Link>
    </div>
  );
};
