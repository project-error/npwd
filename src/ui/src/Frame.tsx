export const Frame = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-[390px] h-[844px] bg-cyan-600 text-primary flex flex-col">
      <div className="bg-primary rounded-[40px] flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
};
