import React, { FocusEventHandler, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, IconButton } from '@mui/material';
import { Cached, KeyboardArrowLeft } from '@mui/icons-material';
import { InputBase } from '../../../ui/components/Input';

const PREFIX = 'BrowserURLBar';

const classes = {
  urlInput: `${PREFIX}-urlInput`,
  urlInputFocused: `${PREFIX}-urlInputFocused`,
  root: `${PREFIX}-root`,
};

const StyledBox = styled(Box)(() => ({
  [`& .${classes.urlInput}`]: {
    borderRadius: 18,
    borderWidth: 1,
    borderStyle: 'solid',
    paddingRight: 10,
    paddingLeft: 10,
    marginLeft: 5,
    borderColor: '#787878FF',
    color: '#909090',
    transition: 'color 0.1s ease',
  },

  [`& .${classes.urlInputFocused}`]: {
    color: '#fff',
  },

  [`&.${classes.root}`]: {},
}));

interface BrowserControlsProps {
  setBrowser: (url: string) => void;
  browserUrl: string;
  reloadPage: () => void;
  browserHasHistory: boolean;
  goBack: () => void;
}

export const BrowserURLBar: React.FC<BrowserControlsProps> = ({
  goBack,
  reloadPage,
  browserHasHistory,
  browserUrl,
  setBrowser,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputState, setInputState] = useState('');
  const [isFocused, setFocus] = useState(false);

  const handleFocus: FocusEventHandler = (e) => {
    setInputState(browserUrl);
    setFocus(true);
  };

  const handleFocusOut: FocusEventHandler = (e) => {
    setFocus(false);
    setInputState(browserUrl);
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputState(e.target.value);
  };

  const onEnter: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if ((e as any).code !== 'Enter') return;
    setBrowser(inputState);
    e.currentTarget.blur();
  };

  const styledUrl = browserUrl.replace(/(^\w+:|^)\/\//, '');

  const transformedUrl = isFocused ? inputState : styledUrl;

  return (
    <StyledBox display="flex" py={1} className={classes.root} px={1}>
      <IconButton size="small" onClick={() => reloadPage()}>
        <Cached />
      </IconButton>
      {browserHasHistory && (
        <IconButton size="small" onClick={() => goBack()}>
          <KeyboardArrowLeft />
        </IconButton>
      )}
      <InputBase
        className={classes.urlInput}
        ref={inputRef}
        fullWidth
        onChange={handleChange}
        onKeyDown={onEnter}
        value={transformedUrl}
        classes={{ focused: classes.urlInputFocused }}
        onFocus={handleFocus}
        spellCheck={false}
        onBlur={handleFocusOut}
      />
    </StyledBox>
  );
};
