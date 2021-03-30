import React, { useState } from 'react';
import Modal from '../../../ui/components/Modal';
import { useCustomWallpaperModal, useSettings } from '../hooks/useSettings';
import { Box, Button, TextField } from '@material-ui/core';
import { PictureThumbnail } from '../../../ui/components/PictureThumbnail';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { StatusButton } from '../../../ui/components/StatusButton';

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
  const [value, setValue] = useState(settings.customWallpaper ? settings.customWallpaper : '');
  const classes = useStyles();

  const isImage = (url) => {
    return /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|png|jpeg|gif)/g.test(url);
  };

  const handleCloseModal = () => {
    setCustomWallpaperModal(false);
  };

  const handleSettingChange = (key: string | number, value: unknown) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleNewWallpaper = () => {
    handleSettingChange('customWallpaper', value);
  };

  const handleRemoveWallpaper = () => {
    handleSettingChange('customWallpaper', '');
  };

  return (
    <Modal visible={customWallpaperModal} handleClose={handleCloseModal}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        flexDirection="column"
      >
        {settings.customWallpaper && (
          <PictureThumbnail src={settings.customWallpaper} alt="chipisbest" />
        )}
        <TextField
          value={value}
          variant="outlined"
          className={classes.input}
          onChange={(e) => setValue(e.currentTarget.value)}
          inputProps={{
            className: classes.inputProps,
          }}
          placeholder="Image URL"
        />
        <Button
          color="primary"
          variant="contained"
          disabled={!isImage(value)}
          onClick={handleNewWallpaper}
          style={{ marginBottom: 10 }}
        >
          {t('APPS_SETTINGS_SET_CUSTOM_WALLPAPER')}
        </Button>
        {settings.customWallpaper && (
          <StatusButton color="error" variant="contained" onClick={handleRemoveWallpaper}>
            {t('GENERIC_DELETE')}
          </StatusButton>
        )}
      </Box>
    </Modal>
  );
}
