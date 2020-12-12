import React, { useEffect, useState } from 'react';
import Notification from '../../../../ui/components/Notification';
import { usePhone } from '../../../../os/phone/hooks/usePhone';
import { useTranslation } from 'react-i18next';
import useStyles from './notification.style';
import { useBankNotification } from '../../hooks/useBankNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWonSign } from '@fortawesome/free-solid-svg-icons';

export const BankNotification = () => {
  const { notification } = useBankNotification();
  const classes = useStyles();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const { config } = usePhone();

  useEffect(() => {
    if (notification) {
      setVisible(true);
    }
  }, [notification?.id]);

  if (!config?.bank.showNotifications || !notification) return null;

  return (
    <Notification
      key={notification.id}
      open={visible}
      handleClose={() => setVisible(false)}
    >
      <div className={classes.content}>
        <div className={classes.title}>
          <div className={classes.titleLeft}>
            <div className={classes.icon}>
              <FontAwesomeIcon icon={faWonSign} />
            </div>
            <div className={classes.heading}>{notification.type}</div>
          </div>
          <div className={classes.justNow}>{t('APPS_BANK_TIME_JUST_NOW')}</div>
        </div>
        <div className={classes.message}>
          {notification.source} sent you ${notification.transferAmount}.{' '}
          <br></br> {notification.message}
        </div>
      </div>
    </Notification>
  );
};
