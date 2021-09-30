import React, { useState } from 'react';
import { useCustomWallpaperModal, useSettings } from '../hooks/useSettings';
import { useTranslation } from 'react-i18next';
import DialogForm from '../../../ui/components/DialogForm';
import { useSnackbar } from '../../../ui/hooks/useSnackbar';
import { TextField } from '../../../ui/components/Input';

const WallpaperModal: React.FC = () => {
  const [customWallpaperModal, setCustomWallpaperModal] = useCustomWallpaperModal();
  const [settings, setSettings] = useSettings();
  const { t } = useTranslation();
  const [value, setValue] = useState(settings.wallpaper.value ? settings.wallpaper.value : '');
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
        label: 'APPS_SETTINGS_OPTIONS_CUSTOM_WALLPAPER',
        value,
      });
      setCustomWallpaperModal(false);
    } else {
      addAlert({ message: t('SETTINGS.OPTIONS.CUSTOM_WALLPAPER.DIALOG_ERROR'), type: 'error' });
    }
  };

  return (
    <DialogForm
      open={customWallpaperModal}
      handleClose={() => setCustomWallpaperModal(false)}
      onSubmit={handleNewWallpaper}
      title={t('SETTINGS.OPTIONS.CUSTOM_WALLPAPER.DIALOG_TITLE')}
      content={t('SETTINGS.OPTIONS.CUSTOM_WALLPAPER.DIALOG_CONTENT')}
    >
      <TextField
        value={value}
        error={!isImageAndUrl(value) && true}
        onChange={(e) => setValue(e.currentTarget.value)}
        placeholder={t('SETTINGS.OPTIONS.CUSTOM_WALLPAPER.DIALOG_PLACEHOLDER')}
        fullWidth
      />
    </DialogForm>
  );
};

export default WallpaperModal;
