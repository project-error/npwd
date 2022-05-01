import React, { useState } from 'react';
import { Box, Fab } from '@mui/material';
import { useChannelsValue } from '../../state/state';
import { ChannelItem } from '../ui/ChannelItem';
import { List } from '@ui/components/List';
import AddIcon from '@mui/icons-material/Add';
import { NewChannelModal } from '../ui/NewChannelModal';
import Backdrop from '@ui/components/Backdrop';
import { useDarkchatAPI } from '../../hooks/useDarkchatAPI';

const ChatList: React.FC = () => {
  const channels = useChannelsValue();
  const [modal, setModal] = useState<boolean>(false);

  const toggleModal = () => {
    setModal((curVal) => !curVal);
  };

  return (
    <Box>
      <NewChannelModal open={modal} closeModal={toggleModal} />
      {modal && <Backdrop />}
      <List>
        {channels.map((channel) => (
          <ChannelItem key={channel.id} {...channel} />
        ))}
      </List>
      <Box position="absolute" bottom={20} right={20}>
        <Fab onClick={toggleModal}>
          <AddIcon />
        </Fab>
      </Box>
    </Box>
  );
};

export default ChatList;
