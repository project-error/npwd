import React, { useEffect, useState } from 'react';
import { Box } from '@material-ui/core';

import { useTranslation } from 'react-i18next';

import { SearchField } from '../../../../ui/components/SearchField';
import { useDebounce } from '../../../../os/phone/hooks/useDebounce';
import { useSetContactFilterInput } from '../../hooks/state';

export const SearchContacts = () => {
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
        placeholder={t('APPS_CONTACT_PLACEHOLDER_SEARCH_CONTACTS')}
        value={inputVal}
      />
    </Box>
  );
};
