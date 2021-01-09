import React, { useEffect, useState } from 'react';
import { AppWrapper } from '../../../ui/components';
import { AppTitle } from '../../../ui/components/AppTitle';
import { AppContent } from '../../../ui/components/AppContent';
import {
  useContextMenu,
  MapStringOptions,
} from '../../../ui/hooks/useContextMenu';
import { useConfig } from '../../../config/hooks/useConfig';
import { useSettings } from '../hooks/useSettings';
import { List } from '../../../ui/components/List';
import { useSimcard } from '../../../os/simcard/hooks/useSimcard';
import { useApp } from '../../../os/apps/hooks/useApps';
import { SettingItem } from './SettingItem';

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
import useLocalStorage, {
  writeStorage,
  getStorage,
} from '../../../os/phone/hooks/useLocalStorage';

const SubHeaderComp = (props: { text: string }) => (
  <ListSubheader component='div' disableSticky>
    {props.text}
  </ListSubheader>
);

export const SettingsApp = () => {
  const settingsApp = useApp('SETTINGS');
  const [config] = useConfig();
  const simcard = useSimcard();

  const [wallpaper, setWallpaper] = useLocalStorage<any>(
    'wallpaper',
    'surf.jpg'
  );
  const [frame, setFrame] = useLocalStorage<any>('frame', 's10.png');
  const [theme, setTheme] = useLocalStorage<any>('theme', 'default-dark');
  const [zoom, setZoom] = useLocalStorage<any>('zoom', '100%');
  const [ringtone, setRingtone] = useLocalStorage<any>('ringtone', '');

  const wallpapers = config.wallpapers.map(
    MapStringOptions(wallpaper, (val: string) => setWallpaper(val))
  );
  const frames = config.frames.map(
    MapStringOptions(frame, (val: string) => setFrame(val))
  );
  const themes = Object.keys(config.themes).map(
    MapStringOptions(theme, (val: string) => setTheme(val))
  );
  const zoomOptions = config.zoomOptions.map(
    MapStringOptions(zoom, (val: string) => setZoom(val))
  );
  // Doesn't actually do anything for the time being
  const ringtones = config.ringtones.map(
    MapStringOptions(ringtone, (val: string) => setRingtone(val))
  );
  // * Probably gonna make this a slider component in the future
  // const ringtoneVols = config.ringtoneVols.map(
  //   MapStringOptions(settings.ringtoneVol, (val: number) => setSettings('ringtoneVol', val))
  // )

  // TODO: These new settings all work

  useEffect(() => {}, [getStorage]);

  const [openMenu, closeMenu, ContextMenu, isMenuOpen] = useContextMenu();
  return (
    <AppWrapper>
      <AppTitle app={settingsApp} />
      <AppContent backdrop={isMenuOpen} onClickBackdrop={closeMenu}>
        <List disablePadding subheader={<SubHeaderComp text='Phone' />}>
          <SettingItem
            label='Phone Number'
            value={simcard.number}
            icon={<Phone />}
          />
          <SettingItem
            label='Ringtone'
            value={getStorage('ringtone')}
            options={ringtones}
            onClick={openMenu}
            icon={<LibraryMusic />}
          />
          {
            // * NOTE: This component is most likely temporary
            // * Probably want to make it a slider in the future. Ignore hardcoded for the meantime
          }
          <SettingItem
            label='Ringtone Volume'
            value='100%'
            options={['100%', '80%', '70%']}
            onClick={openMenu}
            icon={<VolumeUp />}
          />
        </List>
        <List disablePadding subheader={<SubHeaderComp text='Appearance' />}>
          <SettingItem
            label='Theme'
            value={getStorage('theme')}
            options={themes}
            onClick={openMenu}
            icon={<Brush />}
          />
          <SettingItem
            label='Wallpaper'
            value={getStorage('wallpaper')}
            options={wallpapers}
            onClick={openMenu}
            icon={<Wallpaper />}
          />
          <SettingItem
            label='Frame'
            value={getStorage('frame')}
            options={frames}
            onClick={openMenu}
            icon={<Smartphone />}
          />
          <SettingItem
            label='Zoom'
            value={getStorage('zoom')}
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
