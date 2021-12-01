import React from 'react';
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useNotesValue, useSetModalVisible } from '../hooks/state';
import { useSetSelectedNote } from '../hooks/state';
import { NoteItem } from '../../../../../typings/notes';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) => ({
  noNotes: {
    color: theme.palette.text.secondary,
  },
}));

// TODO: add search bar later
const NoteList = () => {
  const classes = useStyles();
  const notes = useNotesValue();
  const setNote = useSetSelectedNote();
  const [t] = useTranslation();
  const setModalVisible = useSetModalVisible();

  const handleNoteModal = (note: NoteItem) => {
    setNote(note);
    setModalVisible(true);
  };

  if (notes && notes.length)
    return (
      <List disablePadding>
        {notes.map((note) => (
          <ListItem key={note.id} button divider onClick={() => handleNoteModal(note)}>
            <ListItemText>{note.title}</ListItemText>
          </ListItem>
        ))}
      </List>
    );

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      height="100%"
      className={classes.noNotes}
    >
      <Typography color="inherit" variant="h6" style={{ fontWeight: 300 }}>
        {t('NOTES.FEEDBACK.NO_NOTES')}
      </Typography>
    </Box>
  );
};

export default NoteList;
