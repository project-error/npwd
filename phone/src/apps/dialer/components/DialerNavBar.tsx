import React, { useState } from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  icon: {
    color: theme.palette.primary.main,
  },
}));

const DialerNavBar: React.FC = () => {
  const classes = useStyles();
  const { pathname } = useLocation();
  const [page, setPage] = useState(pathname);
  const { t } = useTranslation();

  const handleChange = (_e, newPage) => {
    setPage(newPage);
  };

  return (
    <BottomNavigation value={page} onChange={handleChange} showLabels className={classes.root}>
      <BottomNavigationAction
        label={t('APPS_DIALER_NAVBAR_HISTORY')}
        value="/phone"
        component={NavLink}
        icon={<HistoryIcon />}
        to="/phone"
      />
      <BottomNavigationAction
        label={t('APPS_DIALER_NAVBAR_DIAL')}
        value="/phone/dial"
        color="secondary"
        component={NavLink}
        icon={<PhoneIcon />}
        to="/phone/dial"
      />
      <BottomNavigationAction
        label={t('APPS_DIALER_NAVBAR_CONTACTS')}
        value="/phone/contacts"
        color="secondary"
        component={NavLink}
        icon={<PersonIcon />}
        to="/phone/contacts"
      />
    </BottomNavigation>
  );
};

export default DialerNavBar;
