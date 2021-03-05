import React from 'react';
import { AppWrapper } from '../../../ui/components';
import { AppTitle } from '../../../ui/components/AppTitle';
import { AppContent } from '../../../ui/components/AppContent';
import { useContextMenu, MapSettingItem, SettingOption } from '../../../ui/hooks/useContextMenu';
import { useConfig } from '../../../config/hooks/useConfig';
import { List } from '../../../ui/components/List';
import { useSimcard } from '../../../os/simcard/hooks/useSimcard';
import { useApp } from '../../../os/apps/hooks/useApps';
import { SettingItem, SettingItemIconAction, SettingItemSlider } from './SettingItem';
import { useTranslation } from 'react-i18next';

import {
  Brush,
  Wallpaper,
  Phone,
  Smartphone,
  ZoomIn,
  LibraryMusic,
  VolumeUp,
  FileCopy,
} from '@material-ui/icons';

import { ListSubheader } from '@material-ui/core';
import { useSettings } from '../hooks/useSettings';
// import { useSnackbar } from '../../../ui/hooks/useSnackbar';

const SubHeaderComp = (props: { text: string }) => (
  <ListSubheader color="primary" component="div" disableSticky>
    {props.text}
  </ListSubheader>
);

export const SettingsApp = () => {
  const settingsApp = useApp('SETTINGS');
  const [config] = useConfig();
  const simcard = useSimcard();
  const { settings, setSettings } = useSettings();
  const { t } = useTranslation();
  // TODO: Uncomment when #135 is merged
  // const { addAlert } = useSnackbar();

  const handleSettingChange = (key: string | number, value: unknown) => {
    setSettings({ ...settings, [key]: value });
  };

  const wallpapers = config.wallpapers.map(
    MapSettingItem(settings.wallpaper, (val: SettingOption) =>
      handleSettingChange('wallpaper', val),
    ),
  );
  const frames = config.frames.map(
    MapSettingItem(settings.frame, (val: SettingOption) => handleSettingChange('frame', val)),
  );
  const themes = config.themes.map(
    MapSettingItem(settings.theme, (val: SettingOption) => handleSettingChange('theme', val)),
  );
  const zoomOptions = config.zoomOptions.map(
    MapSettingItem(settings.zoom, (val: SettingOption) => handleSettingChange('zoom', val)),
  );
  const ringtones = config.ringtones.map(
    MapSettingItem(settings.ringtone, (val: SettingOption) => handleSettingChange('ringtone', val)),
  );
  const notifications = config.notiSounds.map(
    MapSettingItem(settings.notiSound, (val: SettingOption) =>
      handleSettingChange('notiSound', val),
    ),
  );

  const twitterNotifications = config.notiSounds.map(
    MapSettingItem(settings.TWITTER_notiSound, (val: SettingOption) =>
      handleSettingChange('TWITTER_notiSound', val),
    ),
  );

  const handleCopyPhoneNumber = () => {
    // TODO: Dependent on #132 merge
    // setClipboard(simcard.number)
    // TODO: Dependent on #135 merge
    // addAlert({
    //   message: t('GENERIC_WRITE_TO_CLIPBOARD_MESSAGE', {
    //     content: 'number',
    //   }),
    //   type: 'success',
    // });
  };

  const [openMenu, closeMenu, ContextMenu, isMenuOpen] = useContextMenu();
  return (
    <AppWrapper>
      <AppTitle app={settingsApp} />
      <AppContent backdrop={isMenuOpen} onClickBackdrop={closeMenu}>
        <List disablePadding subheader={<SubHeaderComp text="Phone" />}>
          <SettingItemIconAction
            label={t('APPS_SETTINGS_PHONE_NUMBER')}
            labelSecondary={simcard.number}
            actionLabel={t('GENERIC_WRITE_TO_CLIPBOARD_TOOLTIP', {
              content: 'number',
            })}
            icon={<Phone />}
            actionIcon={<FileCopy />}
            handleAction={handleCopyPhoneNumber}
          />
          <SettingItem
            label={t('APPS_SETTINGS_OPTION_RINGTONE')}
            value={settings.ringtone.label}
            options={ringtones}
            onClick={openMenu}
            icon={<LibraryMusic />}
          />
          <SettingItemSlider
            label={t('APPS_SETTINGS_OPTION_RINGTONEVOL')}
            icon={<VolumeUp />}
            value={settings.ringtoneVol}
            onCommit={(e, val) => handleSettingChange('ringtoneVol', val)}
          />
          <SettingItem
            label={t('APPS_SETTINGS_OPTION_NOTIFICATION')}
            value={settings.notiSound.label}
            options={notifications}
            onClick={openMenu}
            icon={<LibraryMusic />}
          />
          <SettingItemSlider
            label={t('APPS_SETTINGS_OPTION_NOTIFICATIONVOL')}
            icon={<VolumeUp />}
            value={settings.notiSoundVol}
            onCommit={(e, val) => handleSettingChange('notiSoundVol', val)}
          />
        </List>
        <List disablePadding subheader={<SubHeaderComp text="Appearance" />}>
          <SettingItem
            label={t('APPS_SETTINGS_OPTION_THEME')}
            value={settings.theme.label}
            options={themes}
            onClick={openMenu}
            icon={<Brush />}
          />
          <SettingItem
            label={t('APPS_SETTINGS_OPTION_WALLPAPER')}
            value={settings.wallpaper.label}
            options={wallpapers}
            onClick={openMenu}
            icon={<Wallpaper />}
          />
          <SettingItem
            label={t('APPS_SETTINGS_OPTION_FRAME')}
            value={settings.frame.label}
            options={frames}
            onClick={openMenu}
            icon={<Smartphone />}
          />
          <SettingItem
            label={t('APPS_SETTINGS_OPTION_ZOOM')}
            value={settings.zoom.label}
            options={zoomOptions}
            onClick={openMenu}
            icon={<ZoomIn />}
          />
        </List>
        <List disablePadding subheader={<SubHeaderComp text={t('APPS_TWITTER')} />}>
          <SettingItem
            label={t('APPS_SETTINGS_OPTION_NOTIFICATION')}
            value={settings.TWITTER_notiSound.label}
            options={twitterNotifications}
            onClick={openMenu}
            icon={<LibraryMusic />}
          />
          <SettingItemSlider
            label={t('APPS_SETTINGS_OPTION_NOTIFICATIONVOL')}
            value={settings.TWITTER_notiSoundVol}
            onCommit={(e, val) => handleSettingChange('TWITTER_notiSoundVol', val)}
            icon={<VolumeUp />}
          />
        </List>
      </AppContent>
      <ContextMenu />
    </AppWrapper>
  );
};
