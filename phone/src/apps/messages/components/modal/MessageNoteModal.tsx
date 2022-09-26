import React, { useCallback, useEffect } from 'react';
import Modal from '../../../../ui/components/Modal';
import { Box, Typography, Button } from '@mui/material';
import { useHistory, useLocation } from 'react-router-dom';
import { deleteQueryFromLocation } from '@common/utils/deleteQueryFromLocation';
import { useTranslation } from 'react-i18next';
import { useMessageAPI } from '../../hooks/useMessageAPI';
import { MessageConversation } from '@typings/messages';
import useMessages from '../../hooks/useMessages';
import { useNotesValue } from '@apps/notes/hooks/state';
import { NoteItem } from '@typings/notes';

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
    (note) => {
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
    (note) => {
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

  console.log(notePreview);

  return (
    <>
      <Modal visible={notePreview} handleClose={removeQueryParamImage}>
        <Box py={1}>
          <Typography paragraph>{t('MESSAGES.SHARE_NOTE_TITLE')}</Typography>

          <Typography>{notePreview?.title}</Typography>
          <Typography sx={{ marginBottom: 2 }}>
            {notePreview?.content.substring(0, 25) + ' ...'}
          </Typography>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => sendFromQueryParam(notePreview)}
          >
            {t('GENERIC.SHARE')}
          </Button>
        </Box>
      </Modal>
    </>
  );
};
