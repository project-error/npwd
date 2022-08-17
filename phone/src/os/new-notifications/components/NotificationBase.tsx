import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { IApp } from '@os/apps/config/apps';
import { SnackbarContent } from 'notistack';
import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

const StyledMessage = styled('div')({
  color: 'white',
  fontSize: 16,
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  overflow: 'hidden',
  boxOrient: 'vertical',
  lineClamp: 2,
});

interface NotificationBaseProps {
  app: IApp;
  message: string | React.ReactNode;
}

export const NotificationBase = forwardRef<HTMLDivElement, NotificationBaseProps>((props, ref) => {
  const { app, message } = props;
  const [t] = useTranslation();
  return (
    <SnackbarContent ref={ref} style={{ minWidth: '340px' }}>
      <Box display="flex" alignItems="center" color="white" width="100%" mb={0.7}>
        <Box
          p="5px"
          borderRadius={30}
          bgcolor={app.backgroundColor}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <app.NotificationIcon fontSize="inherit" />
        </Box>
        <Box color="#bfbfbf" fontWeight={400} paddingLeft={1} flexGrow={1} fontSize={16}>
          {t(app.nameLocale)}
        </Box>
      </Box>
      <StyledMessage>{message}</StyledMessage>
    </SnackbarContent>
  );
});
