import { useLocation } from 'react-router';

export const Header = () => {
  const { pathname } = useLocation();

  return <header className="h-8 bg-slate-400 text-secondary px-6 flex gap-4">({pathname})</header>;
};
