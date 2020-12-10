import React from "react";
import { Paper, Typography } from "@material-ui/core";

import { Message, MessageGroup } from "../../../../common/interfaces/messages";
import MessageInput from "../form/MessageInput";
import useStyles from "./modal.styles";
import { MessageImageModal } from "./MessageImageModal";

interface IProps {
  activeMessageGroup: MessageGroup;
  messages: Message[];
}





export const CONVERSATION_ELEMENT_ID = "message-modal-conversation";

const Conversation = ({ activeMessageGroup, messages }: IProps) => {
  const classes = useStyles();


  const isImage = (url) => {
    return /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|png|jpeg|gif)/g.test(url)
  }

  return (
    <>
      <MessageImageModal messageGroupId={activeMessageGroup.groupId}/>
      <div id={CONVERSATION_ELEMENT_ID} className={classes.messageList}>
        {messages.map((message) => (
          <div key={message.id} className={classes.messageContainer}>
            <Paper
              className={message.isMine ? classes.sourceSms : classes.sms}
              variant="outlined"
            >
              {isImage(message.message)  ? (
                <img src={message.message} className={classes.imageMessage}/>
              ) : (
                <div>{message.message}</div>
              )} 
              <Typography variant="subtitle1" color="secondary">
                {activeMessageGroup.isGroupChat && !message.isMine
                  ? message.display || message.phone_number
                  : null}
              </Typography>
            </Paper>
          </div>
        ))}
      </div>
      <MessageInput messageGroupId={activeMessageGroup.groupId} />
    </>
  );
};

export default Conversation;
