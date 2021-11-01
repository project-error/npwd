import React, { memo } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Button } from '@mui/material';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import EmojiIcon from '@mui/icons-material/SentimentSatisfied';
import { usePhone } from '../../../../os/phone/hooks/usePhone';

const useStyles = makeStyles({
  buttons: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'flex-start',
    paddingLeft: '5px', // re-align left buttons after overriding material-ui spacing
  },
  button: {
    background: 'transparent',
    minWidth: '45px', // override default material-ui spacing between buttons
  },
});

export const IconButtons = ({ onImageClick, onEmojiClick }) => {
  const classes = useStyles();
  const { ResourceConfig } = usePhone();

  if (!ResourceConfig) return null;
  const { enableImages, enableEmojis } = ResourceConfig.twitter;

  return (
    <div className={classes.buttons}>
      {enableImages && (
        <Button className={classes.button} onClick={onImageClick}>
          <InsertPhotoIcon color="action" />
        </Button>
      )}
      {enableEmojis && (
        <Button className={classes.button} onClick={onEmojiClick}>
          <EmojiIcon color="action" />
        </Button>
      )}
    </div>
  );
};

export default memo(IconButtons);
