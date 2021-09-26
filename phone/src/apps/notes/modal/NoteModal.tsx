import { Button, Slide, Paper, Typography, Container, Box } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useStyles from './modal.styles';
import { useTranslation } from 'react-i18next';
import { StatusButton } from '../../../ui/components/StatusButton';
import { TextField } from '../../../ui/components/Input';
import { useModalVisible, useSelectedNote } from '../hooks/state';
import { useHistory, useLocation } from 'react-router';
import { useApps } from '../../../os/apps/hooks/useApps';
import { useNotesAPI } from '../hooks/useNotesAPI';

export const NoteModal: React.FC = () => {
  const classes = useStyles();
  const { addNewNote, deleteNote, updateNote } = useNotesAPI();
  const [modalVisible, setModalVisible] = useModalVisible();
  const { t } = useTranslation();
  const [selectedNote, setSelectedNote] = useSelectedNote();
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  const history = useHistory();
  const { getApp } = useApps();
  const location = useLocation();

  const notesApp = useMemo(() => getApp('NOTES'), [getApp]);

  const isNewNote = !Boolean(selectedNote?.id);

  useEffect(() => {
    if (selectedNote !== null) {
      setNoteContent(selectedNote.content);
      setNoteTitle(selectedNote.title);
    }
  }, [selectedNote]);

  const handleDeleteNote = () => {
    deleteNote({ id: selectedNote.id })
      .then(() => {
        setModalVisible(false);
      })
      .catch(console.error);
  };

  const handleUpdateNote = () => {
    updateNote({ id: selectedNote.id, title: noteTitle, content: noteContent })
      .then(() => {
        setModalVisible(false);
      })
      .catch(console.error);
  };

  const handleNewNote = () => {
    addNewNote({ title: noteTitle, content: noteContent })
      .then(() => {
        setModalVisible(false);
      })
      .catch(console.error);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNoteTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNoteContent(e.target.value);
  };

  const _handleClose = () => {
    setModalVisible(false);
  };

  const handleClearContent = () => {
    setSelectedNote(null);
    if (location.search) history.push(notesApp.path);
  };

  if (selectedNote === null) return null;

  return (
    <Slide
      direction="left"
      in={modalVisible}
      mountOnEnter
      unmountOnExit
      onExited={handleClearContent}
    >
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
              maxRows={1}
              label={t('GENERIC.TITLE')}
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
              label={t('GENERIC.CONTENT')}
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
                    onClick={handleNewNote}
                  >
                    {t('GENERIC.SAVE')}
                  </Button>
                </Box>
                <Box display="inline" p={1}>
                  <StatusButton color="error" variant="contained" onClick={_handleClose}>
                    {t('GENERIC.CANCEL')}
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
                    {t('GENERIC.UPDATE')}
                  </Button>
                </Box>
                <Box display="inline" p={1}>
                  <StatusButton color="error" variant="contained" onClick={handleDeleteNote}>
                    {t('GENERIC.DELETE')}
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
