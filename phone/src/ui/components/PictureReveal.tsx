import React, { useEffect, useState } from 'react';
import { Box, makeStyles, Theme } from '@material-ui/core';
import { useSettings } from '../../apps/settings/hooks/useSettings';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles<Theme, { covered: boolean }>((theme) => ({
  cover: {
    cursor: 'pointer',
    backgroundColor: theme.palette.background.default,
    color: theme.palette.getContrastText(theme.palette.background.default),
    visibility: ({ covered }) => (covered ? 'visible' : 'hidden'),
  },
}));

export const PictureReveal: React.FC = ({ children }) => {
  const [settings] = useSettings();
  const [covered, setCovered] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);
  const { t } = useTranslation();
  const classes = useStyles({ covered });

  useEffect(() => {
    if (settings.streamerMode === true) {
      setCovered(true);
    }
    setReady(true);
  }, [settings.streamerMode]);

  const onClickCover = () => setCovered(false);

  return (
    <Box width="100%" position="relative">
      <Box
        onClick={onClickCover}
        className={classes.cover}
        width="100%"
        height="100%"
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
        top={0}
        left={0}
      >
        {t('GENERIC_CLICK_TO_REVEAL')}
      </Box>
      <Box width="100%" height="100%" visibility={ready ? 'visible' : 'hidden'}>
        {children}
      </Box>
    </Box>
  );
};
