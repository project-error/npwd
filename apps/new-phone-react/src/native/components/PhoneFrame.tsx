import { Outlet } from 'react-router';

export const PhoneFrame = () => {
  return (
    <div className="bg-red-200 min-h-screen min-w-screen">
      <div className="bg-white fixed bottom-5 right-5 w-[450px] h-[900px] rounded-xl shadow-lg">
        <Outlet />
      </div>
    </div>
  );
};
