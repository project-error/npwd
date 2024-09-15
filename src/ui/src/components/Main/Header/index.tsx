import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';

export const Header = () => {
  const { pathname } = useLocation();

  return (
    <header className="h-8 bg-secondary text-secondary px-6 flex gap-4">
      ({pathname}) <Link to="/home">Home</Link>
    </header>
  );
};
