import React from 'react';
import { emphasize, makeStyles, Paper } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { InputBase } from './Input';

const useStyles = makeStyles((theme) => ({
  bg: {
    display: 'flex',
    height: '60px',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textFieldInput: {
    fontSize: 20,
  },
  inputRoot: {
    fontWeight: 400,
    fontSize: 18,
    border: '1px solid',
    borderColor: theme.palette.divider,
  },
  inputInput: {
    padding: theme.spacing(1, 4, 1, 4),
    // vertical padding + font size from searchIcon
    transition: theme.transitions.create(['width', 'border']),
    width: '16ch',
    '&:focus': {
      width: '24ch',
      borderLeft: `2px solid ${theme.palette.primary.main} `,
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: emphasize(theme.palette.background.paper, 0.21),
    '&:hover': {
      backgroundColor: emphasize(theme.palette.background.paper, 0.28),
    },
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
  searchIcon: {
    padding: theme.spacing(0, 0.7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  const classes = useStyles();
  return (
    <Paper elevation={24} variant="outlined" className={classes.bg}>
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ 'aria-label': 'search' }}
        />
      </div>
    </Paper>
  );
};
