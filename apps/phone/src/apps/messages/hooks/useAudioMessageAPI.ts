import { usePhone } from '@os/phone/hooks';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { ServerPromiseResp } from '@typings/common';
import { Message, MessageEvents, PreDBMessage } from '@typings/messages';
import fetchNui from '@utils/fetchNui';
import { useTranslation } from 'react-i18next';
import { useActiveMessageConversation } from './state';
import { useMessageActions } from './useMessageActions';
import { AudioEvents, AudioRequest, AudioResponse } from '@typings/audio';
import { blobToBase64 } from '@utils/seralize';

export const useAudioMessageAPI = () => {
  const activeConversation = useActiveMessageConversation();
  const myPhoneNumber = useMyPhoneNumber();
  const { addAlert } = useSnackbar();
  const [t] = useTranslation();
  const { updateLocalMessages } = useMessageActions();

  const uploadRecording = async (blob: Blob, onClose: () => void) => {
    const b64 = await blobToBase64(blob);

    fetchNui<ServerPromiseResp<AudioResponse>, AudioRequest>(AudioEvents.UPLOAD_AUDIO, {
      file: b64,
      size: blob.size,
    }).then((audioRes) => {
      if (audioRes.status !== 'ok') {
        return addAlert({
          type: 'error',
          message: audioRes.errorMsg,
        });
      }

      fetchNui<ServerPromiseResp<Message>, PreDBMessage>(MessageEvents.SEND_MESSAGE, {
        conversationId: activeConversation.id,
        embed: JSON.stringify({ type: 'audio', url: audioRes.data.url }),
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
        onClose();
      });
    });
  };

  return {
    uploadRecording,
  };
};
