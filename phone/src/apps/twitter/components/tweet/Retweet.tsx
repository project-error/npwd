import React from 'react';
import { useTranslation } from 'react-i18next';
import makeStyles from '@mui/styles/makeStyles';
import { Repeat } from '@mui/icons-material';

interface IProps {
  profileName: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.secondary.main,
    fontSize: '16px',
    justifyContent: 'flex-start',
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    paddingBottom: '8px',
    marginBottom: '6px',
    marginTop: '-6px',
  },
}));

function Retweet({ profileName }: IProps) {
  const [t] = useTranslation();
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Repeat /> {profileName} {t('TWITTER.RETWEETED')}
    </div>
  );
}

export default Retweet;
