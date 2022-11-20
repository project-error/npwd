import React, { useEffect } from 'react';
import {
  Typography,
  Grid,
  IconButton,
  Slide,
  Paper,
  Box,
  List,
  Divider,
  GridProps,
  Button,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import SignalIcon from '@mui/icons-material/SignalCellular3Bar';
import Battery90Icon from '@mui/icons-material/Battery90';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import Default from '../../../config/default.json';
import { NotificationItem } from './NotificationItem';
import usePhoneTime from '../../phone/hooks/usePhoneTime';
import { NoNotificationText } from './NoNotificationText';
import {
  notifications,
  useNavbarUncollapsed,
  useUnreadNotificationIds,
  useUnreadNotifications,
} from '@os/new-notifications/state';
import { useRecoilValue } from 'recoil';
import { useApp } from '@os/apps/hooks/useApps';
import { UnreadNotificationBarProps } from '@typings/notifications';
import { useNotification } from '../useNotification';
import { IconAntennaBars4, IconSignal4g, IconWifi } from '@tabler/icons';

interface WrapperGridProps extends GridProps {
  tgtNoti?: UnreadNotificationBarProps;
  key: string | number;
}

const IconUnreadGrid: React.FC<WrapperGridProps> = ({ tgtNoti }) => {
  const notificationTgtApp = useApp(tgtNoti.appId);

  return (
    <Grid
      item
      key={tgtNoti.id}
      component={IconButton}
      sx={{
        color: 'text.primary',
        fontSize: 'small',
      }}
    >
      {notificationTgtApp.notificationIcon}
    </Grid>
  );
};

interface UnreadNotificationListItemProps {
  tgtNotiId: string;
  key: string | number;
}

const UnreadNotificationListItem: React.FC<UnreadNotificationListItemProps> = ({ tgtNotiId }) => {
  const notiContents = useRecoilValue(notifications(tgtNotiId));

  return <NotificationItem key={tgtNotiId} {...notiContents} />;
};

export const NotificationBar = () => {
  const time = usePhoneTime();
  const [barCollapsed, setBarUncollapsed] = useNavbarUncollapsed();

  const unreadNotificationIds = useUnreadNotificationIds();

  const unreadNotifications = useUnreadNotifications();

  const { markAllAsRead } = useNotification();

  const handleClearNotis = async () => {
    setBarUncollapsed(false);
    await markAllAsRead();
  };

  useEffect(() => {
    if (unreadNotificationIds.length === 0) {
      setBarUncollapsed(false);
    }
  }, [unreadNotificationIds, setBarUncollapsed]);

  return (
    <>
      {/*<Grid
        container
        justifyContent="space-between"
        alignItems="center"
        wrap="nowrap"
        onClick={() => {
          setBarUncollapsed((curr) => !curr);
        }}
      >
        {time && (
          <Grid item>
            <Typography variant="button">{time}</Typography>
          </Grid>
        )}
        <Grid container item wrap="nowrap" justifyContent="flex-end" alignItems="center">
          <Grid item>
            <SignalIcon fontSize="small" />
          </Grid>
          <Grid item>
            <Typography variant="button">{Default.cellProvider}</Typography>
          </Grid>
          <Grid item>
            <Battery90Icon style={{ transform: 'rotate(90deg)', display: 'block' }} />
          </Grid>
        </Grid>
      </Grid>*/}
      <div className="flex justify-between items-center px-5 mt-2 absolute z-[999] right-0 top-0">
        <div></div>
        <div></div>
        <div className="flex items-center space-x-2">
          <IconAntennaBars4 className="text-white" />
          <IconWifi className="text-white" />
          <div className="border border-white h-3 w-7 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500" />
        </div>
      </div>
    </>
  );
};
