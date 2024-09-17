import { clsx } from 'clsx';

interface FooterLineProps {
  primary?: boolean;
}
export const FooterLine = ({ primary = false }: FooterLineProps) => {
  return (
    <div className={clsx('h-1.5 rounded-full w-4/12', primary ? 'bg-primary' : 'bg-secondary')} />
  );
};
