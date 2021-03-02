import React, { useEffect, useRef, useState } from 'react';
import { Slide, Paper, Typography, Button } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import useStyles from './modal.styles';
import useMessages from '../../hooks/useMessages';
import Conversation, { CONVERSATION_ELEMENT_ID } from './Conversation';
import MessageSkeletonList from './MessageSkeletonList';
import Nui from '../../../../os/nui-events/utils/Nui';
import { useQueryParams } from '../../../../common/hooks/useQueryParams';
import { MessageGroup } from '../../../../common/typings/messages';
import { useHistory, useParams } from 'react-router-dom';

const LARGE_HEADER_CHARS = 30;
const MAX_HEADER_CHARS = 80;
const MINIMUM_LOAD_TIME = 750;
const MESSAGES_REFRESH_RATE = 5000;

export const MessageModal = () => {
  const classes = useStyles();
  const history = useHistory();
  const activeMessageGroup = useQueryParams<MessageGroup>();
  const { groupId } = useParams<{ groupId: string }>();
  const { messages, setMessages } = useMessages();

  const [minimumLoadPassed, setMimimumLoadPassed] = useState(false);

  const minLoadTimeoutRef = useRef(null);
  const fetchInterval = useRef(null);

  const closeModal = () => {
    history.push('/messages');
    setMessages(null);
    setMimimumLoadPassed(false);
  };

  useEffect(() => {
    if (!groupId) return;

    minLoadTimeoutRef.current = setTimeout(() => {
      setMimimumLoadPassed(true);
    }, MINIMUM_LOAD_TIME);

    fetchInterval.current = setInterval(() => {
      if (!groupId) return;
      Nui.send('phone:fetchMessages', {
        groupId,
      });
    }, MESSAGES_REFRESH_RATE);

    return () => {
      clearInterval(fetchInterval.current);
      fetchInterval.current = null;
      clearTimeout(minLoadTimeoutRef.current);
      minLoadTimeoutRef.current = null;
    };
  }, [groupId]);

  useEffect(() => {
    // when we get a new message group we should scroll to the
    // bottom to show the latest messages
    if (activeMessageGroup) {
      const element = document.getElementById(CONVERSATION_ELEMENT_ID);
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    }
  }, [activeMessageGroup, minimumLoadPassed]);

  // we add a minimum (but short) load time here so that
  // there isn't a quick flash of loading and immediately
  // another flash to the tweets screen.
  const hasLoaded = messages && minimumLoadPassed;

  // don't allow too many characters, it takes too much room
  let header = activeMessageGroup ? activeMessageGroup.groupDisplay : '';
  const truncatedHeader = `${header.slice(0, MAX_HEADER_CHARS).trim()}...`;
  header =
    header.length > MAX_HEADER_CHARS
      ? activeMessageGroup?.label || truncatedHeader
      : header;

  const headerClass =
    header.length > LARGE_HEADER_CHARS ? classes.largeGroupDisplay : classes.groupdisplay;

  return (
    <Slide direction="left" in={!!activeMessageGroup}>
      <Paper className={classes.modalRoot}>
        <Paper className={classes.topContainer}>
          <Button onClick={closeModal}>
            <ArrowBackIcon fontSize="large" />
          </Button>
          <Typography variant="h5" className={headerClass}>
            {header}
          </Typography>
        </Paper>
        {hasLoaded ? (
          <Conversation messages={messages} activeMessageGroup={activeMessageGroup} />
        ) : (
          <MessageSkeletonList />
        )}
      </Paper>
    </Slide>
  );
};
