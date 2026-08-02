import React, { useCallback, useEffect } from 'react';
import { Modal2 } from '../../../../ui/components/Modal';
import { useLocation, useNavigate } from 'react-router';
import { deleteQueryFromLocation } from '@common/utils/deleteQueryFromLocation';
import { useTranslation } from 'react-i18next';
import { useMessageAPI } from '../../hooks/useMessageAPI';
import { MessageConversation } from '@typings/messages';
import useMessages from '../../hooks/useMessages';
import { useNotesValue } from '@apps/notes/hooks/state';
import { NoteItem } from '@typings/notes';
import { Button } from '@npwd/keyos';

interface IProps {
  messageGroup: MessageConversation | undefined;
  notePreview: any;
  onClose(): void;
  noteId?: string;
  setNotePreview: (preview: NoteItem | null) => void;
}

export const MessageNoteModal = ({
  messageGroup,
  onClose,
  noteId,
  setNotePreview,
  notePreview,
}: IProps) => {
  const navigate = useNavigate();
  const [t] = useTranslation();
  const { pathname, search } = useLocation();
  const { sendEmbedMessage } = useMessageAPI();
  const notes = useNotesValue();

  const removeQueryParamImage = useCallback(() => {
    setNotePreview(null);
    navigate(deleteQueryFromLocation({ pathname, search }, 'note'), { replace: true });
  }, [navigate, pathname, search, setNotePreview]);
  const { activeMessageConversation } = useMessages();

  const sendNoteMessage = useCallback(
    (note: NoteItem) => {
      sendEmbedMessage({
        conversationId: messageGroup.id,
        conversationList: activeMessageConversation.conversationList,
        embed: { type: 'note', ...note },
        tgtPhoneNumber: messageGroup.participant,
        message: '',
      });
      onClose();
    },
    [sendEmbedMessage, messageGroup, onClose, activeMessageConversation],
  );

  const sendFromQueryParam = useCallback(
    (note: NoteItem) => {
      sendNoteMessage(note);
      removeQueryParamImage();
    },
    [removeQueryParamImage, sendNoteMessage],
  );

  useEffect(() => {
    if (!noteId) return;
    const note = notes.filter((note) => note.id === Number(noteId));
    setNotePreview(note[0]);
  }, [noteId, notes, setNotePreview]);

  return (
    <>
      <Modal2 visible={notePreview} handleClose={removeQueryParamImage}>
        <div className="space-y-4 py-1">
          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
            {t('MESSAGES.SHARE_NOTE_TITLE')}
          </p>

          <p className="text-base font-medium text-neutral-900 dark:text-neutral-50">
            {notePreview?.title}
          </p>
          <p className="mb-2 text-sm text-neutral-400">
            {notePreview?.content.substring(0, 25) + ' ...'}
          </p>

          <Button
            className="w-full bg-[color:var(--keyos-app-accent)] text-[color:var(--keyos-app-accent-foreground)] hover:brightness-110"
            onClick={() => sendFromQueryParam(notePreview)}
          >
            {t('GENERIC.SHARE')}
          </Button>
        </div>
      </Modal2>
    </>
  );
};
