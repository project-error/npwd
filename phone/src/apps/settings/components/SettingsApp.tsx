import React, { useState } from 'react';
import { AppWrapper } from '../../../ui/components';
import { AppTitle } from '../../../ui/components/AppTitle';
import { AppContent } from '../../../ui/components/AppContent';
import { useContextMenu, MapSettingItem, SettingOption } from '../../../ui/hooks/useContextMenu';
import { useConfig } from '../../../config/hooks/useConfig';
import { List } from '../../../ui/components/List';
import { useSimcard } from '../../../os/simcard/hooks/useSimcard';
import { useApp } from '../../../os/apps/hooks/useApps';
import {
  SettingItem,
  SettingItemIconAction,
  SettingItemSlider,
  SettingSwitch,
  SettingItemModal,
} from './SettingItem';
import { useTranslation } from 'react-i18next';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import {
  FilterList,
  Brush,
  Wallpaper,
  Phone,
  Smartphone,
  ZoomIn,
  LibraryMusic,
  VolumeUp,
  FileCopy,
  Book,
  DeleteForever,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { ListSubheader } from '@material-ui/core';
import { useCustomWallpaperModal, useResetSettings, useSettings } from '../hooks/useSettings';
import { setClipboard } from '../../../os/phone/hooks/useClipboard';
import { useSnackbar } from '../../../ui/hooks/useSnackbar';
import { IContextMenuOption } from '../../../ui/components/ContextMenu';
import WallpaperModal from './WallpaperModal';

const SubHeaderComp = (props: { text: string }) => (
  <ListSubheader color="primary" component="div" disableSticky>
    {props.text}
  </ListSubheader>
);

const useStyles = makeStyles({
  backgroundModal: {
    background: 'black',
    opacity: '0.6',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
});

export const SettingsApp = () => {
  const settingsApp = useApp('SETTINGS');
  const [config] = useConfig();
  const simcard = useSimcard();
  const [settings, setSettings] = useSettings();
  const { t } = useTranslation();
  const { customWallpaperModal, setCustomWallpaperModal } = useCustomWallpaperModal();

  const { addAlert } = useSnackbar();

  const resetSettings = useResetSettings();

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

  const twitterNotificationFilters = config.notiFilters.map(
    MapSettingItem(settings.TWITTER_notiFilter, (val: SettingOption) =>
      handleSettingChange('TWITTER_notiFilter', val),
    ),
  );

  const languages = config.languages.map(
    MapSettingItem(settings.language, (val: SettingOption) => handleSettingChange('language', val)),
  );

  const handleResetOptions = () => {
    resetSettings();
    addAlert({
      message: t('SETTINGS.MESSAGES.SETTINGS_RESET'),
      type: 'success',
    });
  };

  const resetSettingsOpts: IContextMenuOption[] = [
    {
      selected: false,
      onClick: () => handleResetOptions(),
      key: 'RESET_SETTINGS',
      label: t('SETTINGS.OPTIONS.RESET_SETTINGS'),
    },
  ];

  const handleCopyPhoneNumber = () => {
    setClipboard(simcard.number);
    addAlert({
      message: t('GENERIC_WRITE_TO_CLIPBOARD_MESSAGE', {
        content: 'number',
      }),
      type: 'success',
    });
  };

  const [openMenu, closeMenu, ContextMenu, isMenuOpen] = useContextMenu();
  const classes = useStyles();
  return (
    <AppWrapper>
      <AppTitle app={settingsApp} />
      <WallpaperModal />
      <div className={customWallpaperModal ? classes.backgroundModal : undefined} />
      <AppContent backdrop={isMenuOpen} onClickBackdrop={closeMenu}>
        <List disablePadding subheader={<SubHeaderComp text={t('SETTINGS.CATEGORY.PHONE')} />}>
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
          <SettingSwitch
            label={t('APPS_SETTINGS_OPTION_STREAMER_MODE')}
            secondary={t('APPS_SETTING_STREAMER_MODE_DESC')}
            icon={<VisibilityOffIcon />}
            value={settings.streamerMode}
            onClick={(curr) => handleSettingChange('streamerMode', !curr)}
          />
        </List>
        <List disablePadding subheader={<SubHeaderComp text={t('SETTINGS.CATEGORY.APPEARANCE')} />}>
          <SettingItem
            label={t('SETTINGS.OPTIONS.LANGUAGE')}
            value={settings.language.label}
            options={languages}
            onClick={openMenu}
            icon={<Book />}
          />
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
          {/* CUSTOM BACKGROUND */}
          <SettingItemModal
            icon={<Wallpaper />}
            label={t('APPS_SETTINGS_OPTIONS_CUSTOM_WALLPAPER')}
            secondary={settings.customWallpaper}
            onClick={() => setCustomWallpaperModal(true)}
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
            label={t('APPS_SETTINGS_OPTION_NOTIFICATION_FILTER')}
            value={settings.TWITTER_notiFilter.label}
            options={twitterNotificationFilters}
            onClick={openMenu}
            icon={<FilterList />}
          />
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
        <List disablePadding subheader={<SubHeaderComp text={t('SETTINGS.CATEGORY.ACTIONS')} />}>
          <SettingItem
            label={t('SETTINGS.OPTIONS.RESET_SETTINGS')}
            value={`${t('SETTINGS.OPTIONS.RESET_SETTINGS_DESC')}`}
            icon={<DeleteForever />}
            onClick={openMenu}
            options={resetSettingsOpts}
          />
        </List>
      </AppContent>
      <ContextMenu />
    </AppWrapper>
  );
};
