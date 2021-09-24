import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const NoNotificationText: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box width="100%" py={1} textAlign="center">
      <Typography variant="body2" color="textSecondary">
        🎉 {t('NOTIFICATIONS.NO_UNREAD')} 🎉
      </Typography>
    </Box>
  );
};
