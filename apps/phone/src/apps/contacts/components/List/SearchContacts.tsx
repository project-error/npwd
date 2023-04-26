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
      <div className="flex items-center justify-start bg-neutral-200 dark:bg-neutral-800 rounded-md px-2 space-x-2">
        <Search className="h-5 w-5 dark:text-neutral-400" />
        <input
          className="w-full text-base dark:text-neutral-100 py-2 bg-transparent outline-none "
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={t('CONTACTS.PLACEHOLDER_SEARCH_CONTACTS')}
          value={inputVal}
        />
      </div>
    </div>
  );
};
