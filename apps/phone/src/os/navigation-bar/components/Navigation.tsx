import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import AppsIcon from '@mui/icons-material/Apps';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useNavigate, useMatch } from 'react-router-dom';
import { usePhone } from '@os/phone/hooks/usePhone';
import { useNotifications } from '@os/notifications/hooks/useNotifications';
import { IconLayoutList, IconChevronLeft, IconOvalVertical } from '@tabler/icons';

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  //const { pathname } = useMatch("/");

  const handleGoBackInHistory = () => {
    navigate(-1);
  };

  const handleGoToMenu = () => {
    navigate('/');
  };

  return (
    <>
      {/*<BottomNavigation
      className={classes.root}
      onChange={(_e, value) => {
        setBarUncollapsed(false);
        value();
      }}
    >
      <BottomNavigationAction label="Home" value={handleGoToMenu} icon={<AppsIcon />} />
      <BottomNavigationAction
        label="Close"
        value={closePhone}
        icon={<RadioButtonUncheckedIcon />}
      />
      <BottomNavigationAction
        label="Back"
        value={handleGoBackInHistory}
        icon={<KeyboardArrowLeftIcon />}
      />
    </BottomNavigation>*/}
      <div className="bottom-0 absolute w-full">
        <div className="w-full bg-neutral-900 py-4 px-12 flex items-center justify-between">
          <IconLayoutList className="text-neutral-400 h-7 w-7 hover:text-neutral-200" />
          <IconOvalVertical className="text-neutral-400 h-7 w-7 hover:text-neutral-200 " />
          <IconChevronLeft className="text-neutral-400 h-7 w-7 hover:text-neutral-200" />
        </div>
      </div>
    </>
  );
};
