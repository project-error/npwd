import { PenLine } from 'lucide-react';
import { toggleKeys } from '@ui/components';
import { cn } from '@utils/css';

export function TweetButton({ openModal }) {
  return (
    <div className="absolute bottom-[75px] right-[12px]">
      <button
        className={cn(
          'flex h-14 w-14 items-center justify-center rounded-full text-white',
          'bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity',
        )}
        onClick={openModal}
        onMouseUp={() => {
          toggleKeys(false);
        }}
      >
        <PenLine size={24} />
      </button>
    </div>
  );
}

export default TweetButton;
