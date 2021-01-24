import React from 'react';
import { AppWrapper } from '../../../ui/components';
import { AppTitle } from '../../../ui/components/AppTitle';
import { AppContent } from '../../../ui/components/AppContent';
import {
  useContextMenu,
  MapStringOptions,
} from '../../../ui/hooks/useContextMenu';
import { useConfig } from '../../../config/hooks/useConfig';
import { List } from '../../../ui/components/List';
import { useSimcard } from '../../../os/simcard/hooks/useSimcard';
import { useApp } from '../../../os/apps/hooks/useApps';
import { SettingItem } from './SettingItem';
import { useTranslation } from 'react-i18next';

import {
  Brush,
  Wallpaper,
  Phone,
  Smartphone,
  ZoomIn,
  LibraryMusic,
  VolumeUp,
} from '@material-ui/icons';

import { ListSubheader } from '@material-ui/core';
import { useRecoilState } from 'recoil';
import { settingsState } from '../hooks/useSettings';

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
    MapStringOptions(settings.wallpaper, (val: string) =>
      handleSettingChange('wallpaper', val)
    )
  );
  const frames = config.frames.map(
    MapStringOptions(settings.frame, (val: string) =>
      handleSettingChange('frame', val)
    )
  );
  const themes = Object.keys(config.themes).map(
    MapStringOptions(settings.theme, (val: string) =>
      handleSettingChange('theme', val)
    )
  );
  const zoomOptions = config.zoomOptions.map(
    MapStringOptions(settings.zoom, (val: string) =>
      handleSettingChange('zoom', val)
    )
  );
  // Doesn't actually do anything for the time being
  const ringtones = config.ringtones.map(
    MapStringOptions(settings.ringtone, (val: string) =>
      handleSettingChange('ringtone', val)
    )
  );
  // * Probably gonna make this a slider component in the future
  // const ringtoneVols = config.ringtoneVols.map(
  //   MapStringOptions(settings.ringtoneVol, (val: number) => setSettings('ringtoneVol', val))
  // )

  // TODO: These new settings all work

  const [openMenu, closeMenu, ContextMenu, isMenuOpen] = useContextMenu();
  return (
    <AppWrapper>
      <AppTitle app={settingsApp} />
      <AppContent backdrop={isMenuOpen} onClickBackdrop={closeMenu}>
        <List disablePadding subheader={<SubHeaderComp text='Phone' />}>
          <SettingItem
            label={t('APPS_SETTINGS_PHONE_NUMBER')}
            value={simcard.number}
            icon={<Phone />}
          />
          <SettingItem
            label={t('APPS_SETTINGS_OPTION_RINGTONE')}
            value={settings.ringtone}
            options={ringtones}
            onClick={openMenu}
            icon={<LibraryMusic />}
          />
          {
            // * NOTE: This component is most likely temporary
            // * Probably want to make it a slider in the future. Ignore hardcoded for the meantime
          }
          <SettingItem
            label={t('APPS_SETTINGS_OPTION_RINGTONEVOL')}
            value='100%'
            options={['100%', '80%', '70%']}
            onClick={openMenu}
            icon={<VolumeUp />}
          />
        </List>
        <List disablePadding subheader={<SubHeaderComp text='Appearance' />}>
          <SettingItem
            label={t('APPS_SETTINGS_OPTION_THEME')}
            value={settings.theme}
            options={themes}
            onClick={openMenu}
            icon={<Brush />}
          />
          <SettingItem
            label={t('APPS_SETTINGS_OPTION_WALLPAPER')}
            value={settings.wallpaper}
            options={wallpapers}
            onClick={openMenu}
            icon={<Wallpaper />}
          />
          <SettingItem
            label={t('APPS_SETTINGS_OPTION_FRAME')}
            value={settings.frame}
            options={frames}
            onClick={openMenu}
            icon={<Smartphone />}
          />
          <SettingItem
            label={t('APPS_SETTINGS_OPTION_ZOOM')}
            value={settings.zoom}
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
