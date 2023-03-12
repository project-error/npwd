import React from 'react';
import { emphasize, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { InputBase } from './Input';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: emphasize(theme.palette.background.paper, 0.21),
  '&:hover': {
    backgroundColor: emphasize(theme.palette.background.paper, 0.28),
  },
  marginLeft: theme.spacing(1),
  width: 'auto',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 0.7),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const SearchInputBase = styled(InputBase)(({ theme }) => ({
  fontWeight: 400,
  fontSize: 18,
  border: '1px solid',
  borderColor: theme.palette.divider,
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 4, 1, 4),
    // vertical padding + font size from searchIcon
    transition: theme.transitions.create(['width', 'border']),
    width: '16ch',
    '&:focus': {
      width: '24ch',
      borderLeft: `2px solid ${theme.palette.primary.main} `,
    },
  },
}));

const SearchPaper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  height: '60px',
  justifyContent: 'center',
  alignItems: 'center',
}));

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
    <>
      <SearchPaper>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <SearchInputBase
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>
      </SearchPaper>
    </>
  );
};
