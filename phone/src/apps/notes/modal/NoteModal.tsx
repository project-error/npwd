import { Button, Slide, Paper, Typography, Container, Box } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import useStyles from './modal.styles';
import { useTranslation } from 'react-i18next';
import { StatusButton } from '../../../ui/components/StatusButton';
import { DeleteNoteDTO, NoteItem, NotesEvents } from '../../../../../typings/notes';
import { TextField } from '../../../ui/components/Input';
import { fetchNui } from '../../../utils/fetchNui';
import { useSelectedNote } from '../hooks/state';
import { ServerPromiseResp } from '../../../../../typings/common';
import { useSnackbar } from '../../../ui/hooks/useSnackbar';
import { useNotesActions } from '../hooks/useNotesActions';

export const NoteModal = () => {
  const classes = useStyles();
  const { addNote, deleteNote, updateNote } = useNotesActions();
  const { t } = useTranslation();
  const [selectedNote, setSelectedNote] = useSelectedNote();
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const { addAlert } = useSnackbar();

  const isNewNote = !Boolean(selectedNote?.id);

  useEffect(() => {
    if (selectedNote !== null) {
      setNoteContent(selectedNote.content);
      setNoteTitle(selectedNote.title);
    }
  }, [selectedNote]);

  const handleNoteSave = () => {
    fetchNui<ServerPromiseResp<NoteItem>>(NotesEvents.ADD_NOTE, {
      title: noteTitle,
      content: noteContent,
    }).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          message: t('APPS_NOTES_ADD_FAILED'),
          type: 'error',
        });
      }

      addNote(resp.data);

      addAlert({
        message: t('APPS_NOTES_ADD_SUCCESS'),
        type: 'success',
      });
      setSelectedNote(null);
    });
  };

  const handleDeleteNote = () => {
    fetchNui<ServerPromiseResp<DeleteNoteDTO>>(NotesEvents.DELETE_NOTE, selectedNote).then(
      (resp) => {
        if (resp.status !== 'ok') {
          return addAlert({
            message: t('APPS_NOTES_DELETE_FAILED'),
            type: 'error',
          });
        }

        deleteNote(resp.data.id);

        addAlert({
          message: t('APPS_NOTES_DELETE_SUCCESS'),
          type: 'success',
        });
      },
    );
    setSelectedNote(null);
  };

  const handleUpdateNote = () => {
    fetchNui<ServerPromiseResp>(NotesEvents.ADD_NOTE, selectedNote).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          message: t('APPS_NOTES_UPDATE_FAILED'),
          type: 'error',
        });
      }

      updateNote({ id: selectedNote.id, title: noteTitle, content: noteContent });

      addAlert({
        message: t('APPS_NOTES_UPDATE_SUCCESS'),
        type: 'success',
      });
    });
    setSelectedNote(null);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNoteTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNoteContent(e.target.value);
  };

  const _handleClose = () => {
    setSelectedNote(null);
  };

  if (selectedNote === null) return null;

  return (
    <Slide direction="left" in={Boolean(selectedNote)} mountOnEnter unmountOnExit>
      <Paper className={classes.modalRoot} square>
        <Container>
          <Box>
            <Box py={2}>
              <Button
                color="primary"
                size="large"
                startIcon={<ArrowBackIcon fontSize="large" />}
                onClick={_handleClose}
              >
                {t('APPS_NOTES')}
              </Button>
            </Box>
            <TextField
              className={classes.input}
              rowsMax={1}
              label={t('GENERIC_TITLE')}
              inputProps={{
                className: classes.inputPropsTitle,
                maxLength: 25,
              }}
              fullWidth
              value={noteTitle}
              onChange={handleTitleChange}
            />
            <TextField
              className={classes.input}
              inputProps={{
                className: classes.inputPropsContent,
                maxLength: 250,
              }}
              label={t('GENERIC_CONTENT')}
              multiline
              fullWidth
              rows={16}
              variant="outlined"
              value={noteContent}
              onChange={handleContentChange}
            />
            <Typography paragraph>{noteContent.length}/250</Typography>
            {isNewNote ? (
              <>
                <Box display="inline" p={1}>
                  <Button
                    color="primary"
                    variant="contained"
                    disabled={noteTitle.length <= 0}
                    onClick={handleNoteSave}
                  >
                    {t('GENERIC_SAVE')}
                  </Button>
                </Box>
                <Box display="inline" p={1}>
                  <StatusButton color="error" variant="contained" onClick={_handleClose}>
                    {t('GENERIC_CANCEL')}
                  </StatusButton>
                </Box>
              </>
            ) : (
              <>
                <Box display="inline" p={1}>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={handleUpdateNote}
                    disabled={noteTitle.length <= 0}
                  >
                    {t('GENERIC_UPDATE')}
                  </Button>
                </Box>
                <Box display="inline" p={1}>
                  <StatusButton color="error" variant="contained" onClick={handleDeleteNote}>
                    {t('GENERIC_DELETE')}
                  </StatusButton>
                </Box>
              </>
            )}
          </Box>
        </Container>
      </Paper>
    </Slide>
  );
};
