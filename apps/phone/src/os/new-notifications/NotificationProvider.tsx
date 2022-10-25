import { APP_TWITTER } from '@apps/twitter/utils/constants';
import { css } from '@emotion/css';
import { useApps } from '@os/apps/hooks/useApps';
import { TwitterEvents } from '@typings/twitter';
import { useNuiEvent } from 'fivem-nui-react-lib';
import { useSnackbar } from 'notistack';
import { createContext, useState } from 'react';
import { NotificationBase } from './components/NotificationBase';

const NotificationContext = createContext(null);

const styles = {
  root: css({
    background: 'rgba(38,38,38,0.85) !important',
    borderRadius: '12px !important',
    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
    backdropFilter: 'blur(4px)',
  }),
};

export const NotificationProvider: React.FC = ({ children }) => {
  // we'll probably change this out with a recoil family
  const [notis, setNotis] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const { getApp } = useApps();

  const addNotification = (data: any) => {
    const app = getApp(data.appId);
    enqueueSnackbar(<NotificationBase app={app} message={data.message} />, {
      className: styles.root,
    });
  };

  useNuiEvent(APP_TWITTER, TwitterEvents.CREATE_TWEET_BROADCAST, addNotification);
  return <NotificationContext.Provider value={null}>{children}</NotificationContext.Provider>;
};
