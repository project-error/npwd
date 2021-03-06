import React from 'react';
import { Box } from '@material-ui/core';

import { useTranslation } from 'react-i18next';

import { useFilteredContacts } from '../../hooks/useFilteredContacts';
import { SearchField } from '../../../../ui/components/SearchField';

export const SearchContacts = () => {
  const { setFilteredContacts, filteredContacts } = useFilteredContacts();
  const { t } = useTranslation();

  return (
    <Box>
      <SearchField
        onChange={(e) => setFilteredContacts(e.target.value)}
        placeholder={t('APPS_CONTACT_PLACEHOLDER_SEARCH_CONTACTS')}
        value={filteredContacts}
      />
    </Box>
  );
};
