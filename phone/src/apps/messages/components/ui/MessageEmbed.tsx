import React from 'react';
import { Avatar, Box, Button, Typography, IconButton, Tooltip } from '@mui/material';
import { Contact } from '@typings/contact';
import { Location } from '@typings/messages';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import StyledMessage from './StyledMessage';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import fetchNui from '../../../../utils/fetchNui';
import TravelExplore from '@mui/icons-material/TravelExplore';
import { MessageEvents } from '@typings/messages';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { NoteItem } from '@typings/notes';
import qs from 'qs';

interface MessageEmbedProps {
  type: string;
  embed: any;
  isMine: boolean;
  message: string;
  openMenu: () => void;
}

type MessageEmbedType = {
  [key: string]: JSX.Element;
};

const MessageEmbed: React.FC<MessageEmbedProps> = ({ type, embed, isMine, message, openMenu }) => {
  const embedType: MessageEmbedType = {
    contact: <ContactEmbed embed={embed} isMine={isMine} openMenu={openMenu} />,
    location: <LocationEmbed embed={embed} isMine={isMine} message={message} openMenu={openMenu} />,
    note: <NoteEmbed embed={embed} isMine={isMine} openMenu={openMenu} />,
  };

  return <>{embedType[type]}</>;
};

const ContactEmbed = ({
  isMine,
  embed,
  openMenu,
}: {
  isMine: boolean;
  embed: Contact;
  openMenu: () => void;
}) => {
  const [t] = useTranslation();
  const history = useHistory();
  const { pathname } = useLocation();
  const { getContactByNumber } = useContactActions();

  const showAddButton = !isMine && !getContactByNumber(embed?.number);

  const handleAddContact = () => {
    const referal = encodeURIComponent(pathname);
    history.push(`/contacts/-1?addNumber=${embed.number}&name=${embed.display}&referal=${referal}`);
  };

  return (
    <StyledMessage>
      <Box>
        <Avatar src={embed?.avatar} />
        <Typography>{embed?.display}</Typography>
        <Typography>{embed?.number}</Typography>
      </Box>
      {showAddButton && (
        <Box pl={1}>
          <Button fullWidth variant="contained" color="primary" onClick={handleAddContact}>
            {t('GENERIC.ADD')}
          </Button>
        </Box>
      )}
      {isMine && (
        <IconButton color="primary" onClick={openMenu}>
          <MoreVertIcon />
        </IconButton>
      )}
    </StyledMessage>
  );
};

const NoteEmbed = ({
  isMine,
  embed,
  openMenu,
}: {
  isMine: boolean;
  embed: NoteItem;
  openMenu: () => void;
}) => {
  const [t] = useTranslation();
  const history = useHistory();
  const { pathname } = useLocation();

  const handleViewNote = () => {
    const queryStr = qs.stringify({
      title: embed?.title,
      content: embed?.content,
    });

    const referal = encodeURIComponent(pathname);
    history.push(`/notes/?${queryStr}&referal=${referal}`);
  };

  return (
    <StyledMessage>
      <Box>
        <Typography>{embed?.title}</Typography>
        <Typography>{embed?.content.substring(0, 8) + ' ...'}</Typography>
      </Box>
      <Box>
        <Tooltip title={t('MESSAGES.NOTE_TOOLTIP')}>
          <IconButton color="primary" onClick={handleViewNote}>
            <TextSnippetIcon />
          </IconButton>
        </Tooltip>
        {isMine && (
          <IconButton color="primary" onClick={openMenu}>
            <MoreVertIcon />
          </IconButton>
        )}
      </Box>
    </StyledMessage>
  );
};

const LocationEmbed = ({
  isMine,
  embed,
  message,
  openMenu,
}: {
  embed: Location;
  isMine: boolean;
  message: string;
  openMenu: () => void;
}) => {
  const [t] = useTranslation();

  const handleSetWaypoint = () => {
    fetchNui(MessageEvents.MESSAGES_SET_WAYPOINT, {
      coords: embed.coords,
    });
  };

  return (
    <StyledMessage>
      <Box>
        <Typography>{message ?? t('MESSAGES.LOCATION_MESSAGE')}</Typography>
      </Box>
      <Box>
        <Tooltip title={t('MESSAGES.LOCATION_TOOLTIP')}>
          <IconButton color="primary" onClick={handleSetWaypoint}>
            <TravelExplore />
          </IconButton>
        </Tooltip>
        {isMine && (
          <IconButton color="primary" onClick={openMenu}>
            <MoreVertIcon />
          </IconButton>
        )}
      </Box>
    </StyledMessage>
  );
};

export default MessageEmbed;
