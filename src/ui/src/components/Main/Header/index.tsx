import { Notifications } from '../Notifications';

export const Header = () => {
  return (
    <header className="h-8 bg-secondary text-secondary px-6 flex gap-4">
      <span>22:03</span>
      <Notifications />
    </header>
  );
};
