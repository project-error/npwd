import { Box, Link, makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';
import { Message } from '../../../../common/typings/messages';

const useStyles = makeStyles((theme) => ({
  imageMessage: {
    width: '80%',
    maxWidth: '80%',
    height: '80%',
    maxHeight: '80%',
  },
  mySms: {
    float: 'right',
    margin: theme.spacing(1),
    padding: '6px 16px',
    height: 'auto',
    width: 'auto',
    minWidth: '60%',
    maxWidth: '85%',
    background: theme.palette.background.default,
    color: theme.palette.text.primary,
    borderRadius: '20px',
    textOverflow: 'ellipsis',
  },
  sms: {
    float: 'left',
    margin: theme.spacing(1),
    padding: '6px 12px',
    width: 'auto',
    minWidth: '60%',
    maxWidth: '85%',
    height: 'auto',
    background: theme.palette.primary.light,
    color: theme.palette.getContrastText(theme.palette.primary.light),
    borderRadius: '15px',
    textOverflow: 'ellipsis',
  },
}));

const isImage = (url) => {
  return /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|png|jpeg|gif)/g.test(url);
};

export const MessageBubble = ({
  message,
  isGroupChat,
  onClickDisplay,
}: {
  message: Message;
  isGroupChat: boolean;
  onClickDisplay(phoneNumber: string): void;
}) => {
  const classes = useStyles();
  return (
    <div>
      <Paper className={message.isMine ? classes.mySms : classes.sms} variant="outlined">
        <Box>
          {isImage(message.message) ? (
            <img src={message.message} className={classes.imageMessage} alt="multimedia" />
          ) : (
            <div>{message.message}</div>
          )}
        </Box>
        <Box>
          {isGroupChat && !message.isMine ? (
            <Link onClick={() => onClickDisplay(message.phone_number)}>
              <Typography variant="subtitle1" color="secondary">
                {message.display || message.phone_number}
              </Typography>
            </Link>
          ) : null}
        </Box>
      </Paper>
    </div>
  );
};
