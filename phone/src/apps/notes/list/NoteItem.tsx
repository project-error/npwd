import { ListItem, ListItemText } from '@material-ui/core'
import React from 'react'

export const NoteItem = (note) => {
  return (
    <ListItem button divider>
      <ListItemText>{note.title}</ListItemText>
    </ListItem>
  )
}
