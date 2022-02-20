import { Search } from '@mui/icons-material';
import { IconButton, Paper, styled } from '@mui/material';
import { InputBase } from '@ui/components/Input';
import { FormEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';

const StyledPaper = styled(Paper)({
  padding: '0.5rem 1.5rem',
  display: 'flex',
  alignItems: 'center',
  borderRadius: '3rem',
});

interface IMarketplaceSearch {
  onSearch(term: string): void;
}

const MarketplaceSearch = (props: IMarketplaceSearch) => {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState('');

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    props.onSearch(searchInput);
  };

  return (
    <form onSubmit={handleSubmit}>
      <StyledPaper>
        <InputBase
          aria-label="Search"
          sx={{ flex: 1 }}
          value={searchInput}
          placeholder={t('GENERIC.SEARCH')}
          onChange={(event) => setSearchInput(event.target.value)}
        />
        <IconButton sx={{ color: ({ palette }) => palette.text.secondary }} type="submit">
          <Search />
        </IconButton>
      </StyledPaper>
    </form>
  );
};

export default MarketplaceSearch;
