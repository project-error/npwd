import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import TwitterIcon from '@material-ui/icons/Twitter';
import { useTwitterNotification } from '../../hooks/useTwitterNotification';
import Notification from '../../../../ui/components/Notification';

const useStyles = makeStyles({
  content: {
    padding: '5px 8px',
    overflowY: 'hidden'
  },
  title: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  titleLeft: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  icon: {
    marginTop: '3px',
    marginRight: '5px'
  },
  profileName: {
    marginBottom: '3px',
  },
  justNow: {
    fontSize: '18px',
    fontStyle: 'italic',
    paddingRight: '3px',
  },
  message: {
    fontSize: '16px',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  }
});

function TwitterNotification() {
  const classes = useStyles();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const { notification } = useTwitterNotification();

  useEffect(() => {
    setVisible(true);
  }, [notification?.id])

  if (!notification) return null;

  return (
    <Notification key={notification.id} open={visible} handleClose={() => setVisible(false)}>
      <div className={classes.content}>
        <div className={classes.title}>
          <div className={classes.titleLeft}>
            <div className={classes.icon}><TwitterIcon /></div>
            <div className={classes.profileName}>@{notification.profile_name}</div>
          </div>
          <div className={classes.justNow}>{t("APPS_TWITTER_JUST_NOW")}</div>
        </div>
        <div className={classes.message}>{notification.message}</div>
      </div>
    </Notification>
  );
}


export default TwitterNotification;
