import { useLocation } from 'react-router';
import { closePhone } from '../../../api/phone';

export const Header = () => {
  const { pathname } = useLocation();

  const handleClick = async () => {
    await closePhone();
  };

  return (
    <header className="h-8 bg-secondary text-secondary px-6 flex gap-4">
      ({pathname}) <button onClick={handleClick}>close phone</button>
    </header>
  );
};
