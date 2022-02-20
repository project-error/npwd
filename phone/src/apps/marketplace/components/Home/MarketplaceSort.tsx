import { Box, Stack, Typography } from '@mui/material';
import { MarketplaceListing } from '@typings/marketplace';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import * as React from 'react';
import SelectUnstyled, {
  SelectUnstyledProps,
  selectUnstyledClasses,
} from '@mui/base/SelectUnstyled';
import OptionUnstyled, { optionUnstyledClasses } from '@mui/base/OptionUnstyled';
import PopperUnstyled from '@mui/base/PopperUnstyled';
import { styled } from '@mui/system';
import { red, grey } from '@mui/material/colors';

const StyledButton = styled('button')(
  ({ theme }) => `
  font-weight: 800;
  color: ${theme.palette.mode === 'dark' ? grey[400] : grey[800]};
  width: 10rem;
  box-sizing: border-box;
  min-height: calc(1.5em + 22px);
  border: none;
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border-radius: 0.75em;
  margin: 0.5em;
  text-align: left;
  padding: 0.5rem 1rem;

  &:hover {
    background: ${theme.palette.mode === 'dark' ? grey[700] : grey[100]}
    
  }

  &.${selectUnstyledClasses.focusVisible} {
    outline: 3px solid ${theme.palette.mode === 'dark' ? red[600] : red[100]};
  }

  &.${selectUnstyledClasses.expanded} {
    &::after {
      content: '▴';
    }
  }

  &::after {
    content: '▾';
    float: right;
  }
  `,
);

const StyledListbox = styled('ul')(
  ({ theme }) => `
  font-weight: 800;
  color: ${grey[600]};

  font-size: 0.875rem;
  box-sizing: border-box;
  padding: 5px;
  margin: 10px 0;
  width: 10rem;
  background-color: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[300]};
  border-radius: 0.75em;
  overflow: auto;
  outline: 0px;
  `,
);

const StyledOption = styled(OptionUnstyled)(
  ({ theme }) => `
  font-weight: 800;
  color: ${grey[600]};
  margin: 0.25rem 0;

  max-width: 10rem;
  list-style: none;
  padding: 0.5rem 0.5rem;
  border-radius: 0.45em;
  cursor: default;

  &:last-of-type {
    border-bottom: none;
  }

  &.${optionUnstyledClasses.selected} {
    background-color: ${theme.palette.mode === 'dark' ? red[800] : red[800]};
    color: ${theme.palette.mode === 'dark' ? red[100] : red[200]};
  }

  &.${optionUnstyledClasses.highlighted} {
    background-color: ${theme.palette.mode === 'dark' ? grey[900] : grey[100]};
    color: ${theme.palette.mode === 'dark' ? grey[100] : grey[900]};
  }

  &.${optionUnstyledClasses.highlighted}.${optionUnstyledClasses.selected} {
    background-color: ${theme.palette.mode === 'dark' ? red[800] : red[300]};
    color: ${theme.palette.mode === 'dark' ? red[100] : 'white'};
  }

  &.${optionUnstyledClasses.disabled} {
    color: ${grey[400]};
  }

  &:hover:not(.${optionUnstyledClasses.disabled}) {
    background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
    color: ${theme.palette.mode === 'dark' ? grey[100] : grey[900]};
  }
  `,
);

const StyledPopper = styled(PopperUnstyled)`
  z-index: 1;
  margin: 0;
`;

const CustomSelect = React.forwardRef(function CustomSelect<TValue>(
  props: SelectUnstyledProps<TValue>,
  ref: React.ForwardedRef<HTMLUListElement>,
) {
  const components: SelectUnstyledProps<TValue>['components'] = {
    Root: StyledButton,
    Listbox: StyledListbox,
    Popper: StyledPopper,
    ...props.components,
  };

  return <SelectUnstyled {...props} ref={ref} components={components} />;
}) as <TValue>(
  props: SelectUnstyledProps<TValue> & React.RefAttributes<HTMLUListElement>,
) => JSX.Element;

export type SortListingsFunction = (a: MarketplaceListing, b: MarketplaceListing) => number;

const sortOptions = {
  newest: {
    label: 'Newest',
    sort: (a: MarketplaceListing, b: MarketplaceListing) => {
      return a.title > b.title ? 1 : -1;
    },
  },
  priceHighest: {
    label: 'Price (desc)',
    sort: (a: MarketplaceListing, b: MarketplaceListing) => {
      return a?.price < b?.price ? 1 : -1;
    },
  },
  priceLowest: {
    label: 'Price (asc)',
    sort: (a: MarketplaceListing, b: MarketplaceListing) => {
      return a?.price > b?.price ? 1 : -1;
    },
  },
};

interface MarketplaceSortProps {
  onChange(sort: SortListingsFunction): void;
}

const MarketplaceSort = ({ onChange }: MarketplaceSortProps) => {
  const { t } = useTranslation();
  useEffect(() => {
    onChange(sortOptions.newest.sort);
  }, [onChange]);

  const handleChange = (value: keyof typeof sortOptions) => {
    const sortFunction = sortOptions[value].sort;
    onChange(sortFunction);
  };

  return (
    <Box position="relative">
      <Stack spacing={0.5}>
        <Typography variant="subtitle2" color="white">
          {t('MARKETPLACE.SORT')}
        </Typography>

        <CustomSelect onChange={handleChange} defaultValue="newest" aria-label="sort">
          {Object.entries(sortOptions).map(([key, value]) => (
            <StyledOption value={key} key={key} aria-label={key}>
              <Typography variant="caption">{value.label}</Typography>
            </StyledOption>
          ))}
        </CustomSelect>
      </Stack>
    </Box>
  );
};

export default MarketplaceSort;
