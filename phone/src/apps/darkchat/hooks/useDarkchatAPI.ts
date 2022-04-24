import { useDarkchatActions } from './useDarkchatActions';
import fetchNui from '@utils/fetchNui';
import { ChannelItemProps, ChannelMessageProps } from '@typings/darkchat';
import { ServerPromiseResp } from '@typings/common';
import { MockChannelMessagesResp } from '../utils/constants';
import { useHistory } from 'react-router-dom';
import { useSetDarkchatMessagesState } from '../state/state';

interface DarkchatAPIProps {
  addChannel: (channel: ChannelItemProps) => void;
  fetchMessages: (conversationId: number) => void;
}

export const useDarkchatAPI = (): DarkchatAPIProps => {
  const { addLocalChannel } = useDarkchatActions();
  const history = useHistory();
  const setMessages = useSetDarkchatMessagesState();

  // FIXME: Fix this
  const addChannel = (channel: ChannelItemProps) => {
    // TODO: Create some types for this, idk what
    fetchNui<ServerPromiseResp<any>>('addsomechanneleventorsmth', { channel }).then((res) => {
      if (res.status !== 'ok') {
        // TODO: ALEEEERT!!!!!
        return;
      }

      addLocalChannel(res.data);
    });
  };

  const fetchMessages = (conversationId: number) => {
    // FIXME: proper events
    fetchNui<ServerPromiseResp<ChannelMessageProps[]>>(
      'getsomemessages',
      { conversationId },
      MockChannelMessagesResp,
    ).then((res) => {
      if (res.status !== 'ok') {
        // TODO: ALEEEERT!!!!!
        history.push('/darkchat');

        return;
      }

      console.log('resp data', res.data);

      setMessages(res.data);
    });
  };

  return { addChannel, fetchMessages };
};
