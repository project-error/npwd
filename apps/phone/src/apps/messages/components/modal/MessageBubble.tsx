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
import { calendarPickerSkeletonClasses } from '@mui/lab';

const useStyles = makeStyles((theme) => ({
  mySms: {
    margin: theme.spacing(1),
    padding: '6px',
    height: 'auto',
    width: 'auto',
    float: 'left',
    borderRadius: '8px',
    textOverflow: 'ellipsis',
  },
  sms: {
    padding: '6px',
    width: 'auto',
    float: 'left',
    minWidth: 'auto',
    maxWidth: 'auto',
    height: 'auto',
    borderRadius: '8px',
    textOverflow: 'ellipsis',
  },
  myAudioSms: {
    float: 'left',
    margin: theme.spacing(1),
    padding: '6px',
    minWidth: '60%',
    maxWidth: '80%',
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
        <Box display="flex" ml={1} alignItems="stretch" mt={1}>
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
      <div className="mb-2 px-2 py-2">
        <div className="flex items-center">
          <div className={cn('flex flex-col space-x-2')}>
            <div>
              {!isMine && (
                <p className="px-2 text-xs font-medium text-neutral-400 dark:text-white">
                  {getContact()?.display ?? message.author}
                </p>
              )}
            </div>
            <div
              className={cn(
                'flex items-center rounded-md px-2 py-2',
                isMine ? 'bg-green-600' : 'bg-neutral-200 dark:bg-neutral-800',
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
                <div>
                  {isMessageImage ? (
                    <PictureReveal>
                      <PictureResponsive src={message.message} alt="message multimedia" />
                    </PictureReveal>
                  ) : (
                    <p
                      className={cn(
                        'text-sm text-neutral-900',
                        isMine ? 'text-white' : 'dark:text-white',
                      )}
                    >
                      {message.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          <div>
            {showVertIcon && (
              <button onClick={openMenu} className="text-neutral-400 dark:text-white">
                <MoreVertical size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="px-2">
          <p className="text-xs text-neutral-400">{dayjs.unix(message.createdAt).fromNow()}</p>
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
