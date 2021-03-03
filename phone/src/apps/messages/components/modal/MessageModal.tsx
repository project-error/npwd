import React, { useEffect, useRef, useState } from 'react';
import {
  Slide,
  Paper,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import useStyles from './modal.styles';
import useMessages from '../../hooks/useMessages';
import Conversation, { CONVERSATION_ELEMENT_ID } from './Conversation';
import MessageSkeletonList from './MessageSkeletonList';
import Nui from '../../../../os/nui-events/utils/Nui';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Modal from '../../../../ui/components/Modal';
import { useContacts } from '../../../contacts/hooks/useContacts';
import { useSimcard } from '../../../../os/simcard/hooks/useSimcard';

const LARGE_HEADER_CHARS = 30;
const MAX_HEADER_CHARS = 80;
const MINIMUM_LOAD_TIME = 750;

export const MessageModal = () => {
  const classes = useStyles();
  const history = useHistory();
  const { number: myNumber } = useSimcard();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { groupId } = useParams<{ groupId: string }>();
  const { messages, setMessages, activeMessageGroup, setActiveMessageGroup } = useMessages();
  const { doesContactExist, getDisplayByNumber } = useContacts();

  const [groupActionsOpen, setGroupActionsOpen] = useState(false);
  const [minimumLoadPassed, setMimimumLoadPassed] = useState(false);

  const minLoadTimeoutRef = useRef(null);

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

    setActiveMessageGroup(groupId);
  }, [groupId, setActiveMessageGroup]);

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

  // sends all unread messages
  useEffect(() => {
    if (activeMessageGroup?.groupId && activeMessageGroup.unreadCount > 0) {
      Nui.send('phone:setReadMessages', {
        groupId: activeMessageGroup.groupId,
      });
    }
  }, [activeMessageGroup]);

  // we add a minimum (but short) load time here so that
  // there isn't a quick flash of loading and immediately
  // another flash to the tweets screen.
  const hasLoaded = messages && minimumLoadPassed;

  // don't allow too many characters, it takes too much room
  let header = activeMessageGroup ? activeMessageGroup.groupDisplay : '';
  const truncatedHeader = `${header.slice(0, MAX_HEADER_CHARS).trim()}...`;
  header = header.length > MAX_HEADER_CHARS ? activeMessageGroup?.label || truncatedHeader : header;

  const headerClass =
    header.length > LARGE_HEADER_CHARS ? classes.largeGroupDisplay : classes.groupdisplay;

  const handleAddContact = (number) => {
    history.push(`/contacts/-1/?addNumber=${number}&referal=${pathname}`);
  };

  const phoneNumbers = activeMessageGroup?.phoneNumbers || [];

  return (
    <div>
      <Modal visible={groupActionsOpen} handleClose={() => setGroupActionsOpen(false)}>
        <Typography variant="h6">{t('APPS_MESSAGES_MEMBERS_TITLE')}</Typography>
        <List>
          {phoneNumbers.map((number) => {
            const display = getDisplayByNumber(number);
            return (
              <ListItem divider>
                <ListItemText>
                  {display !== number ? (
                    <span>
                      {display} ({number})
                    </span>
                  ) : (
                    <span>{number}</span>
                  )}
                </ListItemText>
                {!doesContactExist(number) && myNumber !== number && (
                  <ListItemSecondaryAction>
                    <Button onClick={() => handleAddContact(number)}>
                      <PersonAddIcon />
                    </Button>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            );
          })}
        </List>
      </Modal>
      <Slide direction="left" in={!!activeMessageGroup}>
        <Paper className={classes.modalRoot}>
          <Paper>
            <Box display="flex" justifyContent="space-between">
              <Button onClick={closeModal}>
                <ArrowBackIcon fontSize="large" />
              </Button>
              <Typography variant="h5" className={headerClass}>
                {header}
              </Typography>
              {activeMessageGroup?.isGroupChat ? (
                <Button>
                  <MoreVertIcon onClick={() => setGroupActionsOpen(true)} fontSize="large" />
                </Button>
              ) : (
                <Button>
                  <PersonAddIcon
                    onClick={() => handleAddContact(phoneNumbers.find((n) => myNumber !== n))}
                    fontSize="large"
                  />
                </Button>
              )}
            </Box>
          </Paper>
          {hasLoaded ? (
            <Conversation messages={messages} activeMessageGroup={activeMessageGroup} />
          ) : (
            <MessageSkeletonList />
          )}
        </Paper>
      </Slide>
    </div>
  );
};
