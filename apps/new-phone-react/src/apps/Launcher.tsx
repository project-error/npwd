import { AppGrid } from '@native/launcher/components/AppGrid';
import { Battery, Camera, MessageCircle, Phone, SignalMedium, Wifi } from 'lucide-react';

export const Launcher = () => {
  return (
    <div className="h-full w-full bg-gray-100 rounded-xl relative">
      <header className="px-4 py-2 flex justify-between">
        <div>
          <p>9.41</p>
        </div>
        <div className="flex items-center space-x-2">
          <SignalMedium size={24} />
          <Wifi size={20} />
          <Battery />
        </div>
      </header>

      <AppGrid />

      <div className="absolute bottom-5 left-0 right-0 flex justify-center">
        <div className="bg-white shadow-md rounded-full p-4 flex space-x-6">
          <MessageCircle />
          <Camera />
          <Phone />
        </div>
      </div>
    </div>
  );
};
