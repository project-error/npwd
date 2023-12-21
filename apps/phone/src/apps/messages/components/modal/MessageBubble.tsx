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
import { MoreHorizontal, MoreVertical } from 'lucide-react';
import { cn } from '@utils/css';

const useStyles = makeStyles((theme) => ({
  mySms: {
    float: 'right',
    margin: theme.spacing(1),
    padding: '6px 16px',
    height: 'auto',
    width: 'auto',
    minWidth: '90%',
    maxWidth: '90%',
    borderRadius: '8px',
    textOverflow: 'ellipsis',
  },
  sms: {
    float: 'left',
    padding: '6px 12px',
    width: 'auto',
    marginLeft: 5,
    minWidth: '90%',
    maxWidth: '90%',
    height: 'auto',
    borderRadius: '8px',
    textOverflow: 'ellipsis',
  },
  myAudioSms: {
    float: 'right',
    margin: theme.spacing(1),
    width: 'auto',
    minWidth: '60%',
    maxWidth: '100%',

    borderRadius: '12px',
    textOverflow: 'ellipsis',
  },
  audioSms: {
    float: 'left',
    width: 'auto',
    marginLeft: 5,
    minWidth: '60%',
    maxWidth: '80%',

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
  return /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|png|jpeg|gif|webp)/g.test(url);
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
  if (message.is_embed && parsedEmbed.type === 'audio') {
    return (
      <div>
        <Box
          display="flex"
          ml={1}
          alignItems="stretch"
          justifyContent={isMine ? 'flex-end' : 'flex-start'}
          mt={1}
        >
          <Paper
            className={cn(
              isMine ? classes.myAudioSms : classes.audioSms,
              isMine ? 'bg-green-600' : 'bg-neutral-800',
            )}
            variant="outlined"
          >
            <MessageEmbed
              type={parsedEmbed.type}
              embed={parsedEmbed}
              isMine={isMine}
              message={message.message}
              openMenu={openMenu}
            />
            {!isMine && (
              <Typography fontWeight="bold" fontSize={14} color="#ddd">
                {getContact()?.display ?? message.author}
              </Typography>
            )}
            <p className="mb-1 pl-2 text-xs">{dayjs.unix(message.createdAt).fromNow()}</p>
          </Paper>
        </Box>
        <MessageBubbleMenu open={menuOpen} handleClose={() => setMenuOpen(false)} />
      </div>
    );
  }

  const showVertIcon = isMine || isMessageImage;

  return (
    <>
      <div className={cn('flex w-full flex-row space-x-2 py-2 px-4', isMine ? 'justify-end items-start' : '')}>
        {!isMine ? <Avatar src={getContact()?.avatar} /> : null}
        {showVertIcon && (
          <button onClick={openMenu} className='dark:text-white text-neutral-400'>
            <MoreVertical size={18} />
          </button>
        )}
        <div className="">
          <div
            className={cn(
              'mb-1 flex items-center rounded-md px-2 py-2',
              isMine ? 'float-right bg-green-600' : 'float-left bg-neutral-200 dark:bg-neutral-800',
            )}
          >
            {message.is_embed ? (
              <>
                <MessageEmbed
                  type={parsedEmbed.type}
                  embed={parsedEmbed}
                  isMine={isMine}
                  message={message.message}
                  openMenu={openMenu}
                />
              </>
            ) : (
              <div className="">
                {isMessageImage ? (
                  <PictureReveal>
                    <PictureResponsive src={message.message} alt="message multimedia" />
                  </PictureReveal>
                ) : (
                  <p className={cn("text-sm text-neutral-900", isMine ? "text-white" : "dark:text-white")}>{message.message}</p>
                )}
              </div>
            )}
          </div>
          <div className="">
            <div>
              {!isMine && (
                <p className="text-xs font-medium">{getContact()?.display ?? message.author}</p>
              )}
            </div>
            <div className="">
              <p className="text-xs text-neutral-400">{dayjs.unix(message.createdAt).fromNow()}</p>
            </div>
          </div>
        </div>
      </div>
      <MessageBubbleMenu
        message={message}
        isImage={isMessageImage}
        open={menuOpen}
        handleClose={() => setMenuOpen(false)}
      />
    </>
  );
};
