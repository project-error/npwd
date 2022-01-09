import { Box, IconButton, Paper } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { makeStyles } from '@mui/styles';
import React, { useState } from 'react';
import { Message } from '@typings/messages';
import { PictureResponsive } from '@ui/components/PictureResponsive';
import { PictureReveal } from '@ui/components/PictureReveal';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import MessageBubbleMenu from './MessageBubbleMenu';
import { useSetSelectedMessage } from '../../hooks/state';
import MessageEmbed from '../ui/MessageEmbed';

const useStyles = makeStyles((theme) => ({
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
  message: {
    wordBreak: 'break-word',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

const isImage = (url) => {
  return /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|png|jpeg|gif)/g.test(url);
};

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const classes = useStyles();
  const [menuOpen, setMenuOpen] = useState(false);

  const setSelectedMessage = useSetSelectedMessage();
  const openMenu = () => {
    setMenuOpen(true);
    setSelectedMessage(message);
  };
  const myNumber = useMyPhoneNumber();

  const isMine = message.author === myNumber;

  return (
    <>
      <Paper className={isMine ? classes.mySms : classes.sms} variant="outlined">
        {message.is_embed ? (
          <MessageEmbed type={message.embed.type} embed={message.embed} isMine={isMine} />
        ) : (
          <Box className={classes.message}>
            {isImage(message.message) ? (
              <PictureReveal>
                <PictureResponsive src={message.message} alt="message multimedia" />
              </PictureReveal>
            ) : (
              <>{message.message}</>
            )}
            {isMine && (
              <IconButton onClick={openMenu}>
                <MoreVertIcon />
              </IconButton>
            )}
          </Box>
        )}
      </Paper>
      <MessageBubbleMenu open={menuOpen} handleClose={() => setMenuOpen(false)} />
    </>
  );
};
