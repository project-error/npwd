import {
  Button,
  TextField,
  Slide,
  Paper,
  Typography,
  Container,
  CircularProgress,
  Box,
} from '@material-ui/core';
import React from 'react';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useNoteDetail } from '../hooks/useNoteDetail';
import useStyles from './modal.styles';
import { useNuiRequest } from 'fivem-nui-react-lib';
import { useTranslation } from 'react-i18next';
import { StatusButton } from '../../../ui/components/StatusButton';
import { NotesEvents } from '../../../../../typings/notes';

export const NoteModal = () => {
  const Nui = useNuiRequest();
  const classes = useStyles();
  const { t } = useTranslation();
  const { detail, setDetail } = useNoteDetail();

  const _handleClose = () => {
    setDetail(null);
  };

  const handleNoteSave = () => {
    Nui.send(NotesEvents.ADD_NOTE, detail);
    setDetail(null);
  };

  const handleDeleteNote = () => {
    const id = detail.id;
    Nui.send(NotesEvents.DELETE_NOTE, id);
    setDetail(null);
  };

  const handleUpdateNote = () => {
    Nui.send(NotesEvents.UPDATE_NOTE, detail);
    setDetail(null);
  };

  return (
    <Slide direction="left" in={!!detail} mountOnEnter unmountOnExit>
      <Paper className={classes.modalRoot} square>
        {!detail ? (
          <CircularProgress />
        ) : (
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
                value={detail.title}
                onChange={(e) => setDetail((d) => ({ ...d, title: e.target.value }))}
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
                value={detail.content}
                onChange={(e) => setDetail((d) => ({ ...d, content: e.target.value }))}
              />
              <Typography paragraph>{detail.content.length}/250</Typography>
              {!detail.id ? (
                <>
                  <Box display="inline" p={1}>
                    <Button
                      color="primary"
                      variant="contained"
                      disabled={detail.title.length > 0 ? false : true}
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
                    <Button color="primary" variant="contained" onClick={handleUpdateNote}>
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
        )}
      </Paper>
    </Slide>
  );
};
