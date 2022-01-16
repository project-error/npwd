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
import useMessages from '../../hooks/useMessages';
import Conversation, { CONVERSATION_ELEMENT_ID } from './Conversation';
import MessageSkeletonList from './MessageSkeletonList';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import { useMessagesState, useMessagesValue } from '../../hooks/state';
import { makeStyles } from '@mui/styles';
import { useMessageAPI } from '../../hooks/useMessageAPI';
import { useCall } from '@os/call/hooks/useCall';
import { Call } from '@mui/icons-material';

const LARGE_HEADER_CHARS = 30;
const MAX_HEADER_CHARS = 80;

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
  const { initializeCall } = useCall();

  const { getContactByNumber, getDisplayByNumber } = useContactActions();
  const messages = useMessagesValue();

  const [isLoaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchMessages(groupId, 0);
    setLoaded(true);
  }, [groupId, fetchMessages]);

  const closeModal = () => {
    history.goBack();
  };

  useEffect(() => {
    if (!groupId) return;
    setActiveMessageConversation(groupId);
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
  if (!activeMessageConversation)
    return (
      <div>
        <CircularProgress />
      </div>
    );

  // don't allow too many characters, it takes too much room
  let header =
    getDisplayByNumber(activeMessageConversation.phoneNumber) ||
    activeMessageConversation.phoneNumber;
  const truncatedHeader = `${header.slice(0, MAX_HEADER_CHARS).trim()}...`;
  header = header.length > MAX_HEADER_CHARS ? truncatedHeader : header;

  const headerClass =
    header.length > LARGE_HEADER_CHARS ? classes.largeGroupDisplay : classes.groupdisplay;

  const handleAddContact = (number) => {
    const exists = getContactByNumber(number);
    const referal = encodeURIComponent(pathname);
    if (exists) {
      return history.push(`/contacts/${exists.id}/?referal=${referal}`);
    }
    return history.push(`/contacts/-1/?addNumber=${number}&referal=${referal}`);
  };

  const targetNumber = activeMessageConversation.phoneNumber;

  return (
    <>
      <Slide direction="left" in={true}>
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
          <Box display="flex" justifyContent="space-between" component={Paper}>
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
            {getDisplayByNumber(targetNumber) === targetNumber ? (
              <Button>
                <PersonAddIcon onClick={() => handleAddContact(targetNumber)} fontSize="large" />
              </Button>
            ) : null}
          </Box>
          {activeMessageConversation ? (
            <Conversation messages={messages} activeMessageGroup={activeMessageConversation} />
          ) : (
            <MessageSkeletonList />
          )}
        </Paper>
      </Slide>
    </>
  );
};
