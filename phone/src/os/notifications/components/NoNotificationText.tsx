import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

export const NoNotificationText: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box width="100%" id="test" py={1} textAlign="center">
      <Typography variant="body2" color="textSecondary">
        🎉 {t('NOTIFICATIONS.NO_UNREAD')} 🎉
      </Typography>
    </Box>
  );
};
