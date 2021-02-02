import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import DialGrid from '../DialPadGrid';
import { DialerInput } from '../DialerInput';
import ContactSearch from '../ContactSearch';
import { DialInputCtx } from '../../context/InputContext';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
}));

const DialPage = () => {
  const classes = useStyles();

  const [inputVal, setInputVal] = useState('');

  return (
    <div className={classes.root}>
      <DialInputCtx.Provider
        value={{
          inputVal,
          add: (val: string) => setInputVal(inputVal + val),
          removeOne: () => setInputVal(inputVal.slice(0, -1)),
          clear: () => setInputVal(''),
        }}
      >
        <ContactSearch />
        <DialerInput />
        <DialGrid />
      </DialInputCtx.Provider>
    </div>
  );
};
export default DialPage;
