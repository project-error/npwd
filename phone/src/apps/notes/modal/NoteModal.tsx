import { Button, TextField, Slide } from '@material-ui/core';
import React, { useState } from 'react';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { useNoteModal } from '../hooks/useNoteModal';
import { useNoteDetail } from '../hooks/useNoteDetail';

import useStyles from './modal.styles';

import '../NotesApp.css';
import Nui from '../../../os/nui-events/utils/Nui';

// TODO: Fix input focus color
export const NoteModal = () => {
  const { noteModal, setNoteModal } = useNoteModal();
  const { detail, setDetail } = useNoteDetail();
  const [title, setTitle] = useState(detail ? detail.title : '');
  const [content, setContent] = useState(detail ? detail.content : '');

  const classes = useStyles()

  

  const _handleClose = () => {
    setDetail(null);
    setNoteModal(false);
  };

  const handleNoteSave = () => {
    Nui.send('phone:addNote', {
      title,
      content,
    });
    setDetail(null);
    setNoteModal(false);
    
    setTitle('')
    setContent('')
  };

  const handleDeleteNote = () => {
    const id = detail.id;
    Nui.send('phone:deleteNote', {
      id,
    });
    setDetail(null);
    setNoteModal(false);
  };

  const handleUpdateNote = () => {
    Nui.send('phone:updateNote', {
      id: detail.id,
      title,
      content,
    });
    setDetail(null);
    setNoteModal(false);
  };

  return (
    <div className={noteModal ? classes.modalRoot : classes.modalHide}>
      <Slide direction='left' in={noteModal} mountOnEnter unmountOnExit>
        <div>
          <Button className={classes.closeButton} onClick={_handleClose}>
            <ArrowBackIcon fontSize='large' />
          </Button>
          <div id='notes-modal' className={classes.noteContainer}>
            <TextField
              className={classes.input}
              rowsMax={1}
              placeholder='Title'
              inputProps={{
                className: classes.inputPropsTitle,
                maxLength: 25
              }}
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              className={classes.input}
              inputProps={{
                className: classes.inputPropsContent,
                maxLength: 250,
              }}
              placeholder='Content'
              multiline
              fullWidth
              rows={19}
              variant='outlined'
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <p style={{ color: "#fff" }}>{content.length}/250</p>
            {!detail &&(
              <Button disabled={title.length > 0 ? false : true} className={classes.saveButton} onClick={handleNoteSave}>
                Save
              </Button>
            )}
            {detail && (
              <Button
                className={classes.updateButton}
                onClick={handleUpdateNote}
              >
                Update
              </Button>
            )}
            {detail && (
              <Button
                className={classes.deleteButton}
                onClick={handleDeleteNote}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </Slide>
    </div>
  );
};
