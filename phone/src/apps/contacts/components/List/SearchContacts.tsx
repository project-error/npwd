import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';

import { useTranslation } from 'react-i18next';

import { SearchField } from '../../../../ui/components/SearchField';
import { useDebounce } from '../../../../os/phone/hooks/useDebounce';
import { useSetContactFilterInput } from '../../hooks/state';

export const SearchContacts: React.FC = () => {
  const { t } = useTranslation();
  const setFilterVal = useSetContactFilterInput();
  const [inputVal, setInputVal] = useState('');

  const debouncedVal = useDebounce<string>(inputVal, 500);

  useEffect(() => {
    setFilterVal(debouncedVal);
  }, [debouncedVal, setFilterVal]);

  return (
    <Box>
      <SearchField
        onChange={(e) => setInputVal(e.target.value)}
        placeholder={t('CONTACTS.PLACEHOLDER_SEARCH_CONTACTS')}
        value={inputVal}
      />
    </Box>
  );
};
