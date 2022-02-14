import React, { useEffect, useState } from 'react';
import {
  Slide,
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  Tooltip,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupIcon from '@mui/icons-material/Group';
import useMessages from '../../hooks/useMessages';
import Conversation, { CONVERSATION_ELEMENT_ID } from './Conversation';
import MessageSkeletonList from './MessageSkeletonList';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import { useMessagesState } from '../../hooks/state';
import { makeStyles } from '@mui/styles';
import { useMessageAPI } from '../../hooks/useMessageAPI';
import { useCall } from '@os/call/hooks/useCall';
import { Call } from '@mui/icons-material';
import { useMessageActions } from '../../hooks/useMessageActions';
import GroupDetailsModal from './GroupDetailsModal';
import Backdrop from '@ui/components/Backdrop';

const LARGE_HEADER_CHARS = 30;
const MAX_HEADER_CHARS = 80;
const MINIMUM_LOAD_TIME = 600;

const useStyles = makeStyles({
  tooltip: {
    fontSize: 12,
  },
  modalHide: {
    display: 'none',
  },
  groupdisplay: {
    width: '300px',
    paddingTop: '8px',
    fontSize: '24px',
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
  },
  largeGroupDisplay: {
    width: '300px',
    paddingTop: '8px',
    fontSize: '20px',
    overflowX: 'hidden',
    textOverflow: 'ellipsis',
  },
});

// abandon all hope ye who enter here
export const MessageModal = () => {
  const [t] = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const { pathname } = useLocation();
  const { groupId } = useParams<{ groupId: string }>();
  const { activeMessageConversation, setActiveMessageConversation } = useMessages();
  const { fetchMessages } = useMessageAPI();
  const { getLabelOrContact } = useMessageActions();
  const { initializeCall } = useCall();

  const { getContactByNumber } = useContactActions();
  const [messages, setMessages] = useMessagesState();

  const [isLoaded, setLoaded] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  useEffect(() => {
    fetchMessages(groupId, 0);
  }, [groupId, fetchMessages]);

  useEffect(() => {
    if (activeMessageConversation && messages) {
      setTimeout(() => {
        setLoaded(true);
      }, MINIMUM_LOAD_TIME);
      return;
    }
    setLoaded(false);
  }, [activeMessageConversation, messages]);

  const closeModal = () => {
    setMessages(null);
    history.push('/messages');
  };

  const openGroupModal = () => {
    setIsGroupModalOpen(true);
  };

  const closeGroupModal = () => {
    setIsGroupModalOpen(false);
  };

  useEffect(() => {
    if (!groupId) return;
    setActiveMessageConversation(parseInt(groupId, 10));
  }, [groupId, setActiveMessageConversation]);

  useEffect(() => {
    if (isLoaded) {
      const element = document.getElementById(CONVERSATION_ELEMENT_ID);
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    }
  }, [isLoaded]);

  // We need to wait for the active conversation to be set.
  if (!activeMessageConversation) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }

  let header = getLabelOrContact(activeMessageConversation);
  // don't allow too many characters, it takes too much room
  const truncatedHeader = `${header.slice(0, MAX_HEADER_CHARS).trim()}...`;
  header = header.length > MAX_HEADER_CHARS ? truncatedHeader : header;

  const headerClass =
    header.length > LARGE_HEADER_CHARS ? classes.largeGroupDisplay : classes.groupdisplay;

  // FIXME: Not sure what this is again...
  const handleAddContact = (number: any) => {
    const exists = getContactByNumber(number);
    const referal = encodeURIComponent(pathname);
    if (exists) {
      return history.push(`/contacts/${exists.id}/?referal=${referal}`);
    }
    return history.push(`/contacts/-1/?addNumber=${number}&referal=${referal}`);
  };

  // FIXME: This is wrong :O
  const targetNumber = activeMessageConversation.participant;

  return (
    <Slide direction="left" in={!!activeMessageConversation}>
      <Paper
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexGrow: 1,
          overflowY: 'hidden',
          flexDirection: 'column',
        }}
      >
        <GroupDetailsModal
          open={isGroupModalOpen}
          onClose={closeGroupModal}
          conversationList={activeMessageConversation.conversationList}
          addContact={handleAddContact}
        />
        {isGroupModalOpen && <Backdrop />}
        <Box
          display="flex"
          justifyContent="space-between"
          component={Paper}
          sx={{ borderRadius: 0 }}
        >
          <Button onClick={closeModal}>
            <ArrowBackIcon fontSize="large" />
          </Button>
          <Typography variant="h5" className={headerClass}>
            {header}
          </Typography>
          <Tooltip
            classes={{ tooltip: classes.tooltip }}
            title={`${t('GENERIC.CALL')} ${targetNumber}`}
            placement="bottom"
          >
            <IconButton onClick={() => initializeCall(targetNumber)}>
              <Call fontSize="medium" />
            </IconButton>
          </Tooltip>
          {activeMessageConversation.isGroupChat ? (
            <Button>
              <GroupIcon onClick={openGroupModal} fontSize="large" />
            </Button>
          ) : (
            <Button>
              <PersonAddIcon onClick={() => handleAddContact(targetNumber)} fontSize="large" />
            </Button>
          )}
        </Box>
        {isLoaded && activeMessageConversation ? (
          <Conversation messages={messages} activeMessageGroup={activeMessageConversation} />
        ) : (
          <MessageSkeletonList />
        )}
      </Paper>
    </Slide>
  );
};
