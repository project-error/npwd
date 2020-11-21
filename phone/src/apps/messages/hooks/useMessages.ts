import { useRecoilState, useRecoilValue } from "recoil";
import { Message, MessageGroup } from "../../../common/interfaces/messages";
import { messageState } from "./state";

interface IUseMessages {
  messages?: Message[] | null;
  setMessages: (messages: Message[] | null) => void;
  messageGroups?: MessageGroup[] | null;
}

export default (): IUseMessages => {
  const [messages, setMessages] = useRecoilState<Message[] | null>(
    messageState.messages
  );
  const messageGroups = useRecoilValue<MessageGroup[] | null>(
    messageState.messageGroups
  );
  return { messages, setMessages, messageGroups };
};
