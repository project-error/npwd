import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@utils/css';

export function SearchButton({ handleClick }) {
  return (
    <div className="absolute bottom-[75px] right-[10px]">
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          'flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg',
          'bg-[color:var(--keyos-app-accent)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[color:var(--keyos-app-accent)]',
        )}
      >
        <Search size={24} />
      </button>
    </div>
  );
}

export default SearchButton;
