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

interface MessageEmbedProps {
  type: string;
  embed: any;
  isMine: boolean;
}

type MessageEmbedType = {
  [key: string]: JSX.Element;
};

const MessageEmbed: React.FC<MessageEmbedProps> = ({ type, embed, isMine }) => {
  const embedType: MessageEmbedType = {
    contact: <ContactEmbed embed={embed} isMine={isMine} />,
    location: <LocationEmbed embed={embed} />,
  };

  return <>{embedType[type]}</>;
};

const ContactEmbed = ({ isMine, embed }: { isMine: boolean; embed: Contact }) => {
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
        <Box>
          <Button fullWidth variant="contained" color="primary" onClick={handleAddContact}>
            {t('GENERIC.ADD')}
          </Button>
        </Box>
      )}
    </StyledMessage>
  );
};

const LocationEmbed = ({ embed }: { embed: Location }) => {
  const [t] = useTranslation();
  const handleSetWaypoint = () => {
    fetchNui(MessageEvents.MESSAGES_SET_WAYPOINT, {
      coords: embed.coords,
    });
  };

  return (
    <StyledMessage>
      <Box>
        <Typography>{t('MESSAGES.LOCATION_MESSAGE', { display: embed.display })}</Typography>
      </Box>
      <Box>
        <Tooltip title={t('MESSAGES.LOCATION_TOOLTIP')}>
          <IconButton color="primary" onClick={handleSetWaypoint}>
            <TravelExplore />
          </IconButton>
        </Tooltip>
      </Box>
    </StyledMessage>
  );
};

export default MessageEmbed;
