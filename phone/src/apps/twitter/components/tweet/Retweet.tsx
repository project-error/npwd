import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRetweet } from '@fortawesome/free-solid-svg-icons';

interface IProps {
  profileName: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.secondary.main,
    fontSize: '16px',
    justifyContent: 'flex-start',
    width: '100%',
    paddingBottom: '8px',
    marginBottom: '6px',
    marginTop: '-6px',
  },
}));

function Retweet({ profileName }: IProps) {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <FontAwesomeIcon icon={faRetweet} /> {profileName} {t('APPS_TWITTER_RETWEETED')}
    </div>
  );
}

export default Retweet;
