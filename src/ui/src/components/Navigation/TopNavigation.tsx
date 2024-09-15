import { ReactNode, useEffect } from 'react';

interface TopNavigationProps {
  title: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
}
export const TopNavigation = ({ title, left, right }: TopNavigationProps) => {
  /**
   * Check if there's any scroll on the page, if there is, add a shadow to the top navigation
   */
  useEffect(() => {
    const handleScroll = () => {
      const topNavigation = document.querySelector('nav');
      if (!topNavigation) return;

      if (window.scrollY > 0) {
        topNavigation.classList.add('shadow-md');
      } else {
        topNavigation.classList.remove('shadow-md');
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className="grid grid-cols-3 items-center gap-2 p-4">
      <div className="text-left">{left}</div>
      {typeof title === 'string' ? (
        <h1 className="text-xl font-bold text-center">{title}</h1>
      ) : (
        title
      )}
      <div className="text-right">{right}</div>
    </nav>
  );
};
