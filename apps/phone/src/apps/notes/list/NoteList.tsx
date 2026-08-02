import React from 'react';
import { List } from '@ui/components/List';
import { ListItem } from '@ui/components/ListItem';
import { useNotesValue, useSetModalVisible } from '../hooks/state';
import { useSetSelectedNote } from '../hooks/state';
import { NoteItem } from '@typings/notes';
import { useTranslation } from 'react-i18next';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { useNavigate } from 'react-router';
import { addQueryToLocation } from '@common/utils/addQueryToLocation';
import { getLocationFromUrl } from '@common/utils/getLocationFromUrl';

// TODO: add search bar later
const NoteList = () => {
  const notes = useNotesValue();
  const setNote = useSetSelectedNote();
  const [t] = useTranslation();
  const setModalVisible = useSetModalVisible();
  const query = useQueryParams();
  const navigate = useNavigate();

  const referal = query.referal && decodeURIComponent(query.referal);

  const handleNoteModal = (note: NoteItem) => {
    if (referal) {
      navigate(addQueryToLocation(getLocationFromUrl(referal), 'note', String(note.id)));
      return;
    }
    setNote(note);
    setModalVisible(true);
  };

  if (notes && notes.length)
    return (
      <List disablePadding>
        {notes.map((note) => (
          <ListItem key={note.id} button divider onClick={() => handleNoteModal(note)}>
            <p className="px-4 py-3 text-keyos-fg">{note.title}</p>
          </ListItem>
        ))}
      </List>
    );

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <p className="text-xl font-light text-keyos-fg">{t('NOTES.FEEDBACK.NO_NOTES')}</p>
    </div>
  );
};

export default NoteList;
