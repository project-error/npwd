import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@npwd/keyos';

interface SearchFieldProps {
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  value: string;
  placeholder?: string;
}

const DEFAULT_PROPS = {
  onChange: () => {},
  value: '',
  placeholder: 'Search...',
};

export const SearchField: React.FC<SearchFieldProps> = ({
  value,
  onChange,
  placeholder,
} = DEFAULT_PROPS) => {
  return (
    <div className="flex h-[60px] items-center justify-center">
      <div className="relative w-[16ch] transition-all duration-200 focus-within:w-[24ch]">
        <Search
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-keyos-muted"
        />
        <Input
          aria-label="search"
          className="text-lg"
          onChange={onChange}
          placeholder={placeholder}
          value={value}
          variant="search"
        />
      </div>
    </div>
  );
};
