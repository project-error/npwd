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
  message: string;
}

type MessageEmbedType = {
  [key: string]: JSX.Element;
};

const MessageEmbed: React.FC<MessageEmbedProps> = ({ type, embed, isMine, message }) => {
  const embedType: MessageEmbedType = {
    contact: <ContactEmbed embed={embed} isMine={isMine} message={message} />,
    location: <LocationEmbed embed={embed} isMine={isMine} message={message} />,
  };

  return <>{embedType[type]}</>;
};

const ContactEmbed = ({
  isMine,
  embed,
  message,
}: {
  isMine: boolean;
  embed: Contact;
  message: string;
}) => {
  const [t] = useTranslation();
  const history = useHistory();
  const { pathname } = useLocation();
  const { getContactByNumber } = useContactActions();

  const showAddButton = !isMine && !getContactByNumber(embed?.number);
  const showMessage = message !== t('MESSAGES.CONTACT_SHARED');

  const handleAddContact = () => {
    const referal = encodeURIComponent(pathname);
    history.push(`/contacts/-1?addNumber=${embed.number}&name=${embed.display}&referal=${referal}`);
  };

  return (
    <StyledMessage flexDirection="column">
      {showMessage && <Box sx={{ width: '100%' }}>{message}</Box>}
      <Box display="flex" alignItems="center" sx={{ width: '100%' }}>
        <Box>
          <Avatar src={embed?.avatar} />
          <Typography>{embed?.display}</Typography>
          <Typography>{embed?.number}</Typography>
        </Box>
        {showAddButton && (
          <Box pl={'12px'}>
            <Button fullWidth variant="contained" color="primary" onClick={handleAddContact}>
              {t('GENERIC.ADD')}
            </Button>
          </Box>
        )}
      </Box>
    </StyledMessage>
  );
};

const LocationEmbed = ({
  embed,
  message,
}: {
  embed: Location;
  isMine: boolean;
  message: string;
}) => {
  const [t] = useTranslation();

  const handleSetWaypoint = () => {
    fetchNui(MessageEvents.MESSAGES_SET_WAYPOINT, {
      coords: embed.coords,
    });
  };

  const showMessageAsTypo = message === t('MESSAGES.LOCATION_MESSAGE');

  return (
    <StyledMessage>
      <Box>
        {showMessageAsTypo ? (
          <Typography>{message ?? t('MESSAGES.LOCATION_MESSAGE')}</Typography>
        ) : (
          <>{message}</>
        )}
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
