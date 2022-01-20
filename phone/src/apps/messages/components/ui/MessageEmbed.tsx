import React from 'react';
import { Avatar, Box, Button, Typography } from '@mui/material';
import { Contact } from '@typings/contact';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import StyledMessage from './StyledMessage';
import { useContactActions } from '../../../contacts/hooks/useContactActions';

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

export default MessageEmbed;
