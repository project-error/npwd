import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { useDebounce } from '@os/phone/hooks/useDebounce';
import { useSetContactFilterInput } from '../../hooks/state';
import { Search } from 'lucide-react';

export const SearchContacts: React.FC = () => {
  const [t] = useTranslation();
  const setFilterVal = useSetContactFilterInput();
  const [inputVal, setInputVal] = useState('');

  const debouncedVal = useDebounce<string>(inputVal, 500);

  useEffect(() => {
    setFilterVal(debouncedVal);
  }, [debouncedVal, setFilterVal]);

  return (
    <div className="w-full py-2 px-4">
      <div className="flex items-center justify-start space-x-2 rounded-md bg-gray-200 px-2 dark:bg-neutral-800">
        <Search className="h-5 w-5 dark:text-neutral-400" />
        <input
          className="w-full bg-transparent py-2 text-base outline-none dark:text-neutral-100 "
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={t('CONTACTS.PLACEHOLDER_SEARCH_CONTACTS')}
          value={inputVal}
        />
      </div>
    </div>
  );
};
