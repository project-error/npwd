import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Button, TextField } from '@material-ui/core';
import Nui from '../../../os/nui-events/utils/Nui';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Modal from '../../../ui/components/Modal';
import { useModal } from '../hooks/useModal';
import ClearIcon from '@material-ui/icons/Clear';
import PersonIcon from '@material-ui/icons/Person';
import PhoneIcon from '@material-ui/icons/Phone';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import useStyles from './styles.contactmodal';
import { useTranslation } from "react-i18next";

export const AddContactModal = () => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [avatar, setAvatar] = useState('');
  const classes = useStyles();

  const { t } = useTranslation()

  const { showModal, setShowModal } = useModal();

  const addContact = () => {
    if (name === '' || number === '') {
      console.log('You need to pass in values');
    } else {
      Nui.send('contacts:add', {
        name,
        number,
        avatar,
      });
      console.log(name, number, avatar);
    }
  };

  const _handleClose = () => {
    setShowModal(false);
  };

  return (
    <Modal visible={showModal} handleClose={_handleClose}>
      <Button onClick={_handleClose} className={classes.clearButton}>
        <ClearIcon />
      </Button>
      <List style={{ marginTop: 30 }}>
        <ListItem>
          <PersonIcon className={classes.icons} />
          <TextField
            value={name}
            inputProps={{ className: classes.textInputField }}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            variant='standard'
            placeholder={t('APPS_CONTACT_MODAL_PLACEHOLDER_NAME')}
          />
        </ListItem>
        <ListItem>
          <PhoneIcon className={classes.icons} />
          <TextField
            value={number}
            inputProps={{ className: classes.textInputField }}
            onChange={(e) => setNumber(e.target.value)}
            fullWidth
            placeholder={t('APPS_CONTACT_MODAL_PLACEHOLDER_NUMBER')}
            variant='standard'
            type='text'
          />
        </ListItem>
        <ListItem>
          <AccountCircleIcon className={classes.icons} />
          <TextField
            value={avatar}
            inputProps={{ className: classes.textInputField }}
            onChange={(e) => setAvatar(e.target.value)}
            fullWidth
            placeholder={t('APPS_CONTACT_MODAL_PLACEHOLDER_AVATAR')}
            variant='standard'
            type='text'
          />
        </ListItem>
      </List>
      <Button className={classes.addBtn} onClick={addContact}>
        {t('APPS_CONTACT_MODAL_BUTTON_ADD')}
      </Button>
    </Modal>
  );
};
