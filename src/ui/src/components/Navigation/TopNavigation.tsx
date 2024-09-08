interface TopNavigationProps {
  title: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
}
export const TopNavigation = ({ title, left, right }: TopNavigationProps) => {
  return (
    <nav className="grid grid-cols-3 items-center gap-2 p-4 pb-0">
      <div className="text-left">{left}</div>
      <h1 className="text-xl font-bold">{title}</h1>
      <div className="text-right">{right}</div>
    </nav>
  );
};
