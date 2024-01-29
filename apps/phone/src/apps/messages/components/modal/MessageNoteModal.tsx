import React, { useCallback, useEffect } from 'react';
import { Modal2 } from '../../../../ui/components/Modal';
import { Box, Typography, Button } from '@mui/material';
import { useHistory, useLocation } from 'react-router-dom';
import { deleteQueryFromLocation } from '@common/utils/deleteQueryFromLocation';
import { useTranslation } from 'react-i18next';
import { useMessageAPI } from '../../hooks/useMessageAPI';
import { MessageConversation } from '@typings/messages';
import useMessages from '../../hooks/useMessages';
import { useNotesValue } from '@apps/notes/hooks/state';
import { NoteItem } from '@typings/notes';
import { NPWDButton } from '@npwd/keyos';

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
  const history = useHistory();
  const [t] = useTranslation();
  const { pathname, search } = useLocation();
  const { sendEmbedMessage } = useMessageAPI();
  const notes = useNotesValue();

  const removeQueryParamImage = useCallback(() => {
    setNotePreview(null);
    history.replace(deleteQueryFromLocation({ pathname, search }, 'note'));
  }, [history, pathname, search, setNotePreview]);
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

          <NPWDButton
            className="w-full bg-green-600"
            onClick={() => sendFromQueryParam(notePreview)}
          >
            {t('GENERIC.SHARE')}
          </NPWDButton>
        </div>
      </Modal2>
    </>
  );
};
