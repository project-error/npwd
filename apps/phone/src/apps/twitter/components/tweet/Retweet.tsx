import React from 'react';
import { useTranslation } from 'react-i18next';
import { Repeat } from '@mui/icons-material';
import { Box, styled } from '@mui/material';

interface IProps {
  profileName: string;
}

const RetweetContainer = styled(Box)(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontSize: '16px',
  justifyContent: 'flex-start',
  width: '100%',
  display: 'flex',
  alignItems: 'flex-start',
  paddingBottom: '8px',
  marginBottom: '6px',
  marginTop: '-6px',
}));

function Retweet({ profileName }: IProps) {
  const [t] = useTranslation();
  return (
    <RetweetContainer>
      <Repeat /> {profileName} {t('TWITTER.RETWEETED')}
    </RetweetContainer>
  );
}

export default Retweet;
