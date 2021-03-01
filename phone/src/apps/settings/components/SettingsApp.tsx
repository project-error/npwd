import React, { useEffect, useState } from 'react';
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

import {
  Box,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Slider,
} from '@material-ui/core';
import { useRecoilState } from 'recoil';
import { settingsState } from '../hooks/useSettings';

const SubHeaderComp = (props: { text: string }) => (
  <ListSubheader color='primary' component='div' disableSticky>
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

  const [sliders, setSliders] = useState([]);

  useEffect(() => {
    setSliders((curr) => {
      if (!curr.length) {
        return [
          settings.ringtoneVol,
          settings.notificationVol,
          settings.TWITTER_notificationVol,
        ];
      }
      return curr;
    });
  }, [
    settings.notificationVol,
    settings.ringtoneVol,
    settings.TWITTER_notificationVol,
  ]);

  const handleSliderChange = (idx) => (_e: any, value: number | number[]) => {
    setSliders((curr) => {
      const newValues = [...curr];
      newValues[idx] = value;
      return newValues;
    });
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
  const ringtones = config.ringtones.map(
    MapStringOptions(settings.ringtone, (val: string) =>
      handleSettingChange('ringtone', val)
    )
  );
  const notifications = config.notifications.map(
    MapStringOptions(settings.notification, (val: string) =>
      handleSettingChange('notification', val)
    )
  );

  const twitterNotifications = config.notifications.map(
    MapStringOptions(settings.notification, (val: string) =>
      handleSettingChange('TWITTER_notification', val)
    )
  );

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
          <ListItem divider>
            <ListItemIcon>
              <VolumeUp />
            </ListItemIcon>
            <ListItemText
              primary={t('APPS_SETTINGS_OPTION_RINGTONEVOL')}
              secondary={settings.ringtoneVol}
            />
            <ListItemSecondaryAction>
              <Box p={2} width={150}>
                <Slider
                  value={sliders[0] || settings.ringtoneVol}
                  min={0}
                  max={100}
                  onChange={handleSliderChange(0)}
                  onChangeCommitted={() =>
                    handleSettingChange('ringtoneVol', sliders[0])
                  }
                />
              </Box>
              ,
            </ListItemSecondaryAction>
          </ListItem>
          <SettingItem
            label={t('APPS_SETTINGS_OPTION_NOTIFICATION')}
            value={settings.notification}
            options={notifications}
            onClick={openMenu}
            icon={<LibraryMusic />}
          />
          <ListItem divider>
            <ListItemIcon>
              <VolumeUp />
            </ListItemIcon>
            <ListItemText
              primary={t('APPS_SETTINGS_OPTION_NOTIFICATIONVOL')}
              secondary={settings.notificationVol}
            />
            <ListItemSecondaryAction>
              <Box p={2} width={150}>
                <Slider
                  value={sliders[1] || settings.notificationVol}
                  min={0}
                  max={100}
                  onChange={handleSliderChange(1)}
                  onChangeCommitted={() =>
                    handleSettingChange('notificationVol', sliders[1])
                  }
                />
              </Box>
            </ListItemSecondaryAction>
          </ListItem>
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
        <List
          disablePadding
          subheader={<SubHeaderComp text={t('APPS_TWITTER')} />}
        >
          <SettingItem
            label={t('APPS_SETTINGS_OPTION_NOTIFICATION')}
            value={settings.TWITTER_notification}
            options={twitterNotifications}
            onClick={openMenu}
            icon={<LibraryMusic />}
          />
          <ListItem divider>
            <ListItemIcon>
              <VolumeUp />
            </ListItemIcon>
            <ListItemText
              primary={t('APPS_SETTINGS_OPTION_NOTIFICATIONVOL')}
              secondary={settings.TWITTER_notificationVol}
            />

            <ListItemSecondaryAction>
              <Box p={2} width={150}>
                <Slider
                  value={sliders[2] || settings.TWITTER_notificationVol}
                  min={0}
                  max={100}
                  onChange={handleSliderChange(2)}
                  onChangeCommitted={() =>
                    handleSettingChange('TWITTER_notificationVol', sliders[2])
                  }
                />
              </Box>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </AppContent>
      <ContextMenu />
    </AppWrapper>
  );
};
