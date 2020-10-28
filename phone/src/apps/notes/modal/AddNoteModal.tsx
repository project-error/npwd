import { Button, List, ListItem, TextField } from '@material-ui/core';
import React, { useState } from 'react'
import Modal from '../../../ui/components/Modal';
import ClearIcon from "@material-ui/icons/Clear";

import { useNoteModal } from '../hooks/useNoteModal';
import useStyles from './modal.styles';

import '../NotesApp.css'

export const AddNoteModal = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const classes = useStyles();

  const {noteModal, setNoteModal} = useNoteModal();

  const _handleClose = () => {
    setNoteModal(false);
  }

  return (
    <Modal visible={noteModal} handleClose={_handleClose}> 
      <Button onClick={_handleClose} className={classes.closeButton}><ClearIcon /></Button>
      <List style={{ marginTop: 20 }}>
        <ListItem>
          <TextField 
            fullWidth
            className={classes.input}
            placeholder="Title"
            inputProps={{
              className: classes.inputStyles
            }}
            value={title}
            variant="standard"
            onChange={e => setTitle(e.target.value)}
          />
        </ListItem>
        <ListItem>
          <TextField 
              fullWidth
              className={classes.input}
              placeholder="Some shit"
              value={content}
              onChange={e => setContent(e.target.value)}
              variant="outlined"
              multiline
              inputProps={{
                className: classes.inputStyles
              }}
            />
        </ListItem>
      </List>
    </Modal>
  )
}
