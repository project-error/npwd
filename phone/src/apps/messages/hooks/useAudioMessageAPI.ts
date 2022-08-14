import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { ServerPromiseResp } from '@typings/common';
import { Message, MessageEvents, PreDBMessage } from '@typings/messages';
import fetchNui from '@utils/fetchNui';
import { useTranslation } from 'react-i18next';
import { useActiveMessageConversation } from './state';
import { useMessageActions } from './useMessageActions';

export const useAudioMessageAPI = () => {
  const activeConversation = useActiveMessageConversation();
  const myPhoneNumber = useMyPhoneNumber();
  const { addAlert } = useSnackbar();
  const [t] = useTranslation();
  const { updateLocalMessages } = useMessageActions();
  const uploadRecording = async (blob: Blob) => {
    try {
      const form_data = new FormData();
      form_data.append('recording', blob);

      const res = await fetch('http://localhost:5001/recording', {
        method: 'POST',
        body: form_data,
      });

      const response = await res.json();

      fetchNui<ServerPromiseResp<Message>, PreDBMessage>(MessageEvents.SEND_EMBED_MESSAGE, {
        conversationId: activeConversation.id,
        embed: JSON.stringify({ url: response.url }),
        is_embed: true,
        tgtPhoneNumber: '',
        conversationList: activeConversation.conversationList,
        sourcePhoneNumber: myPhoneNumber,
        message: '',
      }).then((res) => {
        if (res.status !== 'ok') {
          return addAlert({
            type: 'error',
            message: t('MESSAGE.FEEDBACK.NEW_MESSAGE_FAILED'),
          });
        }

        updateLocalMessages(res.data);
      });

      // TODO: Update local state
    } catch (err) {
      console.error(err);
    }
  };

  return {
    uploadRecording,
  };
};
