import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@ui/components/Button';
import { StatusButton } from '@ui/components/StatusButton';
import { TextField } from '@ui/components/Input';
import { useModalVisible, useSelectedNote } from '../hooks/state';
import { useLocation, useNavigate } from 'react-router';
import { useNotesAPI } from '../hooks/useNotesAPI';
import { cn } from '@utils/css';

export const NoteModal: React.FC = () => {
  const { addNewNote, deleteNote, updateNote } = useNotesAPI();
  const [modalVisible, setModalVisible] = useModalVisible();
  const [t] = useTranslation();
  const [selectedNote, setSelectedNote] = useSelectedNote();
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [isExiting, setIsExiting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isNewNote = !Boolean(selectedNote?.id);
  const isDisabled = noteTitle.length <= 0;

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
        if (location.search) navigate(-1);
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

  const handleClearContent = () => {
    setSelectedNote(null);
    if (location.search) navigate(-1);
  };

  const handleClose = () => {
    setIsExiting(true);
    setModalVisible(false);
  };

  const handleTransitionEnd = () => {
    if (!modalVisible && isExiting) {
      handleClearContent();
      setIsExiting(false);
    }
  };

  if (selectedNote === null) return null;

  return (
    <div
      className={cn(
        'absolute z-20 h-[99%] w-full bg-keyos-night transition-transform duration-300 ease-out',
        modalVisible ? 'translate-x-0' : 'translate-x-full',
      )}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className="mx-auto max-w-full px-4">
        <div className="py-4">
          <Button
            color="primary"
            size="large"
            startIcon={<ArrowLeft size={24} />}
            onClick={handleClose}
          >
            {t('APPS_NOTES')}
          </Button>
        </div>
        <TextField
          className="mb-5"
          maxRows={1}
          label={t('GENERIC.TITLE')}
          inputProps={{
            className: 'text-[28px]',
            maxLength: 25,
          }}
          fullWidth
          value={noteTitle}
          onChange={handleTitleChange}
        />
        <TextField
          className="mb-5"
          inputProps={{
            className: 'text-xl leading-snug',
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
        <p className="mb-4 text-keyos-muted">{noteContent.length}/250</p>
        {isNewNote ? (
          <>
            <span className="inline-block p-2">
              <Button variant="contained" disabled={isDisabled} onClick={handleNewNote}>
                <span className={cn(isDisabled ? 'text-keyos-muted' : 'text-keyos-fg')}>
                  {t('GENERIC.SAVE')}
                </span>
              </Button>
            </span>
            <span className="inline-block p-2">
              <StatusButton color="error" variant="contained" onClick={handleClose}>
                <span className="text-keyos-fg">{t('GENERIC.CANCEL')}</span>
              </StatusButton>
            </span>
          </>
        ) : (
          <>
            <span className="inline-block p-2">
              <Button
                color="primary"
                variant="contained"
                onClick={handleUpdateNote}
                disabled={isDisabled}
              >
                <span className={cn(isDisabled ? 'text-keyos-muted' : 'text-keyos-fg')}>
                  {t('GENERIC.UPDATE')}
                </span>
              </Button>
            </span>
            <span className="inline-block p-2">
              <StatusButton color="error" variant="contained" onClick={handleDeleteNote}>
                <span className="text-keyos-fg">{t('GENERIC.DELETE')}</span>
              </StatusButton>
            </span>
          </>
        )}
      </div>
    </div>
  );
};
