import React from 'react';
import { AppWrapper } from '../../../ui/components';
import { AppTitle } from '../../../ui/components/AppTitle';
import { AppContent } from '../../../ui/components/AppContent';
import {
  useContextMenu,
  MapSettingItem,
} from '../../../ui/hooks/useContextMenu';
import { useConfig } from '../../../config/hooks/useConfig';
import { List } from '../../../ui/components/List';
import { useSimcard } from '../../../os/simcard/hooks/useSimcard';
import { useApp } from '../../../os/apps/hooks/useApps';
import {
  SettingItem,
  SettingItemIconAction,
  SettingItemSlider,
  SettingItemToggle,
} from './SettingItem';
import { useTranslation } from 'react-i18next';

import {
  Brush,
  Wallpaper,
  Phone,
  Smartphone,
  ZoomIn,
  LibraryMusic,
  VolumeDown,
  Notifications,
  FileCopy,
} from '@material-ui/icons';

import { ListSubheader } from '@material-ui/core';
import { useRecoilState } from 'recoil';
import { settingsState } from '../hooks/useSettings';
import { setClipboard } from '../../../os/phone/hooks/useClipboard';

const SubHeaderComp = (props: { text: string }) => (
  <ListSubheader component='div' disableSticky>
    {props.text}
  </ListSubheader>
);

export const SettingsApp = () => {
  const settingsApp = useApp('SETTINGS');
  const [config] = useConfig();
  const simcard = useSimcard();
  const [settings, setSettings] = useRecoilState(settingsState);

  const handleSettingChange = (key: string | number, value: unknown) => {
    setSettings({ ...settings, [key]: value });
  };

  const { t } = useTranslation();

  const wallpapers = config.wallpapers.map(
    MapSettingItem(settings.wallpaper, (wallpaper) =>
      handleSettingChange('wallpaper', wallpaper)
    )
  );
  const frames = config.frames.map(
    MapSettingItem(settings.frame, (setting) =>
      handleSettingChange('frame', setting)
    )
  );
  const themes = config.themes.map(
    MapSettingItem(settings.theme, (val: string) =>
      handleSettingChange('theme', val)
    )
  );
  const zoomOptions = config.zoomOptions.map(
    MapSettingItem(settings.zoom, (val) => handleSettingChange('zoom', val))
  );
  // // Doesn't actually do anything for the time being
  const ringtones = config.ringtones.map(
    MapSettingItem(settings.ringtone, (val) =>
      handleSettingChange('ringtone', val)
    )
  );

  const handleRingtoneVol = (event: any, val: number | number[]) => {
    handleSettingChange('ringtoneVol', val as number);
  };

  const handleNotiSoundToggle = (event: any, val: boolean) => {
    handleSettingChange('phoneSilenced', val);
  };

  const handleCopyPhoneNumber = () => {
    setClipboard(simcard.number);
  };

  const [openMenu, closeMenu, ContextMenu, isMenuOpen] = useContextMenu();

  return (
    <AppWrapper>
      <AppTitle app={settingsApp} />
      <AppContent backdrop={isMenuOpen} onClickBackdrop={closeMenu}>
        <List disablePadding subheader={<SubHeaderComp text='General' />}>
          <SettingItemIconAction
            icon={<Phone />}
            actionIcon={<FileCopy />}
            label={t('APPS_SETTINGS_PHONE_NUMBER')}
            labelSecondary={simcard.number}
            handleAction={handleCopyPhoneNumber}
          />
          <SettingItemToggle
            label={t('APPS_SETTINGS_OPTION_SILENCED')}
            labelSecondary={t('APPS_SETTINGS_OPTION_SILENCED_DESC')}
            value={settings.phoneSilenced}
            icon={<Notifications />}
            handleChange={handleNotiSoundToggle}
          />
        </List>
        <List disablePadding subheader={<SubHeaderComp text='Audio' />}>
          <SettingItem
            label={t('APPS_SETTINGS_OPTION_RINGTONE')}
            value={settings.ringtone.label}
            options={ringtones}
            onClick={openMenu}
            icon={<LibraryMusic />}
          />
          <SettingItemSlider
            value={100}
            handleChange={handleRingtoneVol}
            label={t('APPS_SETTINGS_OPTION_RINGTONEVOL')}
            icon={<VolumeDown />}
            min={0}
            max={200}
          />
        </List>
        <List disablePadding subheader={<SubHeaderComp text='Appearance' />}>
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
      </AppContent>
      <ContextMenu />
    </AppWrapper>
  );
};
