import { usePhone } from '@os/phone/hooks';
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
  const { ResourceConfig } = usePhone();
  const uploadRecording = async (blob: Blob) => {
    try {
      const form_data = new FormData();
      form_data.append('recording', blob);

      const res = await fetch(ResourceConfig.voiceMessage.url, {
        method: 'POST',
        cache: 'no-store',
        mode: 'cors',
        headers: {
          [ResourceConfig.voiceMessage.authorizationHeader]: ResourceConfig.voiceMessage.token,
        },
        body: form_data,
      });

      const response = await res.json();

      let recordingUrl: string = '';
      for (const index of ResourceConfig.voiceMessage.returnedDataIndexes)
        recordingUrl = response[index];

      fetchNui<ServerPromiseResp<Message>, PreDBMessage>(MessageEvents.SEND_MESSAGE, {
        conversationId: activeConversation.id,
        embed: JSON.stringify({ type: 'audio', url: recordingUrl }),
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

        console.log(res.data);
        updateLocalMessages(res.data);
      });
    } catch (err) {
      console.error(err);
      return addAlert({
        type: 'error',
        message: t('MESSAGE.FEEDBACK.NEW_MESSAGE_FAILED'),
      });
    }
  };

  return {
    uploadRecording,
  };
};
