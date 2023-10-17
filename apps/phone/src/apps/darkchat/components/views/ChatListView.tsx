import React, { useState } from 'react';
import { Box, Fab, useTheme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useChannelsValue } from '../../state/state';
import { ChannelItem } from '../ui/ChannelItem';
import { List } from '@ui/components/List';
import AddIcon from '@mui/icons-material/Add';
import { NewChannelModal } from '../ui/NewChannelModal';
import Backdrop from '@ui/components/Backdrop';

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: theme.palette.action.active,
    color: theme.palette.background.default,
    '&:hover': {
      backgroundColor: theme.palette.text.secondary,
    },
  },
}));

const ChatList: React.FC = () => {
  const channels = useChannelsValue();
  const [modal, setModal] = useState<boolean>(false);
  const phoneTheme = useTheme();
  const classes = useStyles(phoneTheme);

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
        <Fab 
          className={classes.button}
          onClick={toggleModal} 
        >
          <AddIcon />
        </Fab>
      </Box>
    </Box>
  );
};

export default ChatList;
