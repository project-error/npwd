import { useCallback, useEffect } from 'react';
import { Modal2 } from '../../../../ui/components/Modal';
import { useHistory, useLocation } from 'react-router-dom';
import { deleteQueryFromLocation } from '@common/utils/deleteQueryFromLocation';
import { PictureResponsive } from '@ui/components/PictureResponsive';
import { useTranslation } from 'react-i18next';
import { useMessageAPI } from '../../hooks/useMessageAPI';
import { MessageConversation } from '@typings/messages';
import useMessages from '../../hooks/useMessages';
import { NPWDButton } from '@npwd/keyos';

interface IProps {
  messageGroup: MessageConversation | undefined;
  imagePreview: any;
  onClose(): void;
  image?: string;
  setImagePreview: (preview: string | null) => void;
}

export const MessageImageModal = ({
  messageGroup,
  onClose,
  image,
  setImagePreview,
  imagePreview,
}: IProps) => {
  const history = useHistory();
  const [t] = useTranslation();
  const { pathname, search } = useLocation();
  const { sendMessage } = useMessageAPI();
  const removeQueryParamImage = useCallback(() => {
    setImagePreview(null);
    history.replace(deleteQueryFromLocation({ pathname, search }, 'image'));
  }, [history, pathname, search, setImagePreview]);
  const { activeMessageConversation } = useMessages();

  const sendImageMessage = useCallback(
    (m) => {
      sendMessage({
        conversationId: messageGroup.id,
        conversationList: activeMessageConversation.conversationList,
        message: m,
        tgtPhoneNumber: messageGroup.participant,
      });
      onClose();
    },
    [sendMessage, messageGroup, onClose, activeMessageConversation],
  );

  const sendFromQueryParam = useCallback(
    (image) => {
      sendImageMessage(image);
      removeQueryParamImage();
    },
    [removeQueryParamImage, sendImageMessage],
  );

  useEffect(() => {
    if (!image) return;
    setImagePreview(image);
  }, [image, setImagePreview]);

  return (
    <>
      <Modal2 visible={imagePreview} handleClose={removeQueryParamImage}>
        <div className="space-y-4 p-1">
          <p className="text-sm font-medium">{t('MESSAGES.SHARE_IMAGE_TITLE')}</p>
          <PictureResponsive src={imagePreview} alt="Share gallery image preview" />
          <NPWDButton
            onClick={() => sendFromQueryParam(imagePreview)}
            className="w-full bg-green-600"
            size="sm"
          >
            {t('GENERIC.SHARE')}
          </NPWDButton>
        </div>
      </Modal2>
    </>
  );
};
