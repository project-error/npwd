import { Avatar, Box, IconButton, Paper, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { makeStyles } from '@mui/styles';
import React, { useState } from 'react';
import { Message } from '@typings/messages';
import StyledMessage from '../ui/StyledMessage';
import { PictureResponsive } from '@ui/components/PictureResponsive';
import { PictureReveal } from '@ui/components/PictureReveal';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import MessageBubbleMenu from './MessageBubbleMenu';
import { useSetSelectedMessage } from '../../hooks/state';
import MessageEmbed from '../ui/MessageEmbed';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import dayjs from 'dayjs';

const useStyles = makeStyles((theme) => ({
  mySms: {
    float: 'right',
    margin: theme.spacing(1),
    padding: '6px 16px',
    height: 'auto',
    width: 'auto',
    minWidth: '50%',
    maxWidth: '80%',
    background: theme.palette.primary.light,
    color: theme.palette.getContrastText(theme.palette.primary.light),
    borderRadius: '20px',
    textOverflow: 'ellipsis',
  },
  sms: {
    float: 'left',
    padding: '6px 12px',
    width: 'auto',
    marginLeft: 5,
    minWidth: '50%',
    maxWidth: '80%',
    height: 'auto',
    background: theme.palette.background.default,
    color: theme.palette.text.primary,
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
  const { getContactByNumber } = useContactActions();

  const setSelectedMessage = useSetSelectedMessage();
  const openMenu = () => {
    setMenuOpen(true);
    setSelectedMessage(message);
  };
  const myNumber = useMyPhoneNumber();
  const isMine = message.author === myNumber;

  let parsedEmbed;
  if (message?.embed) {
    parsedEmbed = JSON.parse(message?.embed);
  }

  const getContact = () => {
    return getContactByNumber(message.author);
  };

  const isMessageImage = isImage(message.message);

  const showVertIcon = isMine || isMessageImage;

  return (
    <>
      <Box
        display="flex"
        ml={1}
        alignItems="stretch"
        justifyContent={isMine ? 'flex-end' : 'flex-start'}
        mt={1}
      >
        {!isMine ? <Avatar src={getContact()?.avatar} /> : null}
        <Paper className={isMine ? classes.mySms : classes.sms} variant="outlined">
          {message.is_embed ? (
            <MessageEmbed
              type={parsedEmbed.type}
              embed={parsedEmbed}
              isMine={isMine}
              message={message.message}
              openMenu={openMenu}
            />
          ) : (
            <StyledMessage>
              {isMessageImage ? (
                <PictureReveal>
                  <PictureResponsive src={message.message} alt="message multimedia" />
                </PictureReveal>
              ) : (
                <>{message.message}</>
              )}
              {showVertIcon && (
                <IconButton color="primary" onClick={openMenu}>
                  <MoreVertIcon />
                </IconButton>
              )}
            </StyledMessage>
          )}
          {!isMine && (
            <Typography fontWeight="bold" fontSize={14} color="#ddd">
              {getContact()?.display ?? message.author}
            </Typography>
          )}
          <Typography mt={2} fontSize={12}>
            {dayjs.unix(message.createdAt).fromNow()}
          </Typography>
        </Paper>
      </Box>
      <MessageBubbleMenu
        message={message}
        isImage={isMessageImage}
        open={menuOpen}
        handleClose={() => setMenuOpen(false)}
      />
    </>
  );
};
