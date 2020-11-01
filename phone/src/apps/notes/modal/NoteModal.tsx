import { Button, List, ListItem, TextField, Slide, Paper } from '@material-ui/core';
import React, { useState } from 'react'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { useNoteModal } from '../hooks/useNoteModal';
import { useNoteDetail } from '../hooks/useNoteDetail';

import useStyles from './modal.styles';

import { useNotes } from '../hooks/useNotes';


import '../NotesApp.css'
import Nui from '../../../os/nui-events/utils/Nui';

export const NoteModal = (note): any => {
  const { noteModal, setNoteModal } = useNoteModal();
  const { detail, setDetail } = useNoteDetail();
  console.log(detail);
  const [title, setTitle] = useState(detail ? detail.title : "");
  const [content, setContent] = useState(detail ? detail.content: "");

  const classes = useStyles();

  const _handleClose = () => {
    setNoteModal(false);
    console.log(note.title)
    setDetail(null)
    console.log(detail)
  }

  const handleNoteSave = () => {
    console.log(detail)
    console.log(title, content)
    setNoteModal(false);
    setDetail(null)
    Nui.send('phone:addNote', {
      title,
      content
    })
  }

  const handleDeleteNote = () => {
    const id = detail.id
    setNoteModal(false);
    console.log("NoteID: " + id)
    Nui.send('phone:deleteNote', {
      id
    })
    setDetail(null)
  }

  const handleUpdateNote = () => {
   Nui.send('phone:updateNote', {
     id: detail.id,
     title,
     content
   });
   setNoteModal(false);
   setDetail(null)
  }

  return (
    <div className={noteModal ? classes.modalRoot : classes.modalHide}>
      <Slide direction="left" in={noteModal}>
        <div>
          <Button className={classes.closeButton} onClick={_handleClose}><ArrowBackIcon /></Button>
          <div id="notes-modal" className={classes.noteContainer}>
            <TextField 
              className={classes.input}
              placeholder="Title"
              inputProps={{
                className: classes.inputPropsTitle
              }}
              fullWidth
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <TextField 
              className={classes.input}
              inputProps={{
                className: classes.inputPropsContent
              }}
              placeholder="Content"
              multiline
              fullWidth
              rows={19}
              variant="outlined"
              value={content}
              onChange={e => setContent(e.target.value)}
            />
            {!detail && <Button className={classes.saveButton} onClick={handleNoteSave}>Save</Button>}
            {detail && <Button className={classes.updateButton} onClick={handleUpdateNote}>Update</Button>}
            {detail && <Button className={classes.deleteButton} onClick={handleDeleteNote}>Delete</Button>}
          </div>
        </div>
      </Slide>
    </div>
  )
}
