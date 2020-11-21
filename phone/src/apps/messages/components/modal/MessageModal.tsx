import React, { useEffect, useState } from "react";
import { Slide, Paper, Button, Typography } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import useStyles from "./modal.styles";
import useMessages from "../../hooks/useMessages";
import useModals from "../../hooks/useModals";
import Conversation, { CONVERSATION_ELEMENT_ID } from "./Conversation";
import MessageSkeletonList from "./MessageSkeletonList";
import Nui from "../../../../os/nui-events/utils/Nui";

const LARGE_HEADER_CHARS = 30;
const MAX_HEADER_CHARS = 80;
const MINIMUM_LOAD_TIME = 750;
const MESSAGES_REFRESH_RATE = 5000;

export const MessageModal = () => {
  const classes = useStyles();
  const { messages, setMessages } = useMessages();
  const [minimumLoadPassed, setMimimumLoadPassed] = useState(false);
  const { activeMessageGroup, setActiveMessageGroup } = useModals();

  const closeModal = () => {
    setActiveMessageGroup(null);
    setMessages(null);
    setMimimumLoadPassed(false);
  };

  useEffect(() => {
    if (!activeMessageGroup?.groupId) return;

    const timeout = window.setTimeout(() => {
      setMimimumLoadPassed(true);
    }, MINIMUM_LOAD_TIME);

    const interval = window.setInterval(() => {
      if (!activeMessageGroup) return;
      Nui.send("phone:fetchMessages", {
        groupId: activeMessageGroup.groupId,
      });
    }, MESSAGES_REFRESH_RATE);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [activeMessageGroup?.groupId]);

  useEffect(() => {
    // when we get a new message group we should scroll to the
    // bottom to show the latest messages
    if (activeMessageGroup) {
      const element = document.getElementById(CONVERSATION_ELEMENT_ID);
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    }
  }, [minimumLoadPassed, messages?.length]);

  // we add a minimum (but short) load time here so that
  // there isn't a quick flash of loading and immediately
  // another flash to the tweets screen.
  const hasLoaded = messages && minimumLoadPassed;
  const isOpen = activeMessageGroup !== null;

  // don't allow too many characters, it takes too much room
  let header = activeMessageGroup ? activeMessageGroup.groupDisplay : "";
  const truncatedHeader = `${header.slice(0, MAX_HEADER_CHARS).trim()}...`;
  header =
    header.length > MAX_HEADER_CHARS
      ? activeMessageGroup?.label || truncatedHeader
      : header;

  const headerClass =
    header.length > LARGE_HEADER_CHARS
      ? classes.largeGroupDisplay
      : classes.groupdisplay;

  return (
    <Slide direction="left" in={isOpen}>
      <Paper className={isOpen ? classes.modalRoot : classes.modalHide}>
        <Paper className={classes.topContainer}>
          <Button onClick={closeModal}>
            <ArrowBackIcon fontSize="large" />
          </Button>
          <Typography variant="h5" className={headerClass}>
            {header}
          </Typography>
        </Paper>
        {messages && hasLoaded ? (
          <Conversation
            messages={messages}
            activeMessageGroupId={activeMessageGroup?.groupId}
          />
        ) : (
          <MessageSkeletonList />
        )}
      </Paper>
    </Slide>
  );
};
