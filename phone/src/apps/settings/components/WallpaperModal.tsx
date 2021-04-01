import React, { useState } from 'react';
import { useCustomWallpaperModal, useSettings } from '../hooks/useSettings';
import { Box, Button, TextField, Typography } from '@material-ui/core';
import { PictureThumbnail } from '../../../ui/components/PictureThumbnail';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import DialogForm from '../../../ui/components/DialogForm';
import { useSnackbar } from '../../../ui/hooks/useSnackbar';

const useStyles = makeStyles({
  input: {
    marginTop: 10,
    marginBottom: 10,
  },
  inputProps: {
    fontSize: 18,
  },
});

export default function WallpaperModal() {
  const { customWallpaperModal, setCustomWallpaperModal } = useCustomWallpaperModal();
  const [settings, setSettings] = useSettings();
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const { addAlert } = useSnackbar();

  const isImageAndUrl = (url) => {
    return /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|png|jpeg|gif)/g.test(url);
  };

  const handleSettingChange = (key: string | number, value: unknown) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleNewWallpaper = () => {
    if (isImageAndUrl(value)) {
      handleSettingChange('wallpaper', {
        label: t('APPS_SETTINGS_OPTIONS_CUSTOM_WALLPAPER'),
        value,
      });
      setCustomWallpaperModal(false);
    } else {
      addAlert({ message: t('APPS_SETTINGS_INVALID_WALLPAPER'), type: 'error' });
    }
  };

  return (
    <DialogForm
      open={customWallpaperModal}
      handleClose={() => setCustomWallpaperModal(false)}
      onSubmit={handleNewWallpaper}
      title="Custom wallpaper"
      content="Set a custom wallpaper by entering the URL of the image below!"
    >
      <TextField
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        placeholder="Image URL"
        fullWidth
      />
    </DialogForm>
  );
}
