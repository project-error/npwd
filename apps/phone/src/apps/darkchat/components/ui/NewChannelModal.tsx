import React, { useState } from 'react';
import Modal from '@ui/components/Modal';
import { Box, Typography, useTheme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import { TextField } from '@ui/components/Input';
import { Button } from '@ui/components/Button';
import { useDarkchatAPI } from '../../hooks/useDarkchatAPI';

interface NewChannelModalProps {
  open: boolean;
  closeModal: () => void;
}

const useStyles = makeStyles((theme) => ({
  button: {
    color: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    }
  }
}));

export const NewChannelModal: React.FC<NewChannelModalProps> = ({ open, closeModal }) => {
  const [channelValue, setChannelValue] = useState<string>('');
  const [t] = useTranslation();
  const { addChannel } = useDarkchatAPI();
  const phoneTheme = useTheme();
  const classes = useStyles(phoneTheme);

  const handleJoinChannel = () => {
    addChannel({ channelIdentifier: channelValue });

    closeModal();
  };

  return (
    <Modal visible={open} handleClose={closeModal}>
      <Typography>{t('DARKCHAT.NEW_CHANNEL_TITLE')}</Typography>
      <Box mt={3} mb={2}>
        <TextField
          type="password"
          fullWidth
          placeholder={t('DARKCHAT.NEW_CHANNEL_INPUT_PLACEHOLDER')}
          value={channelValue}
          onChange={(e) => setChannelValue(e.currentTarget.value)}
        />
      </Box>

      <Button
        variant="contained"
        className={classes.button}
        onClick={handleJoinChannel}
      >
        {t('DARKCHAT.JOIN_BUTTON')}
      </Button>
    </Modal>
  );
};
