import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import ListItemText from '@mui/material/ListItemText';
import { Box, Button, ListItem } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';

import { FormattedMatch } from '../../../../../../typings/match';
import Profile from '../profile/Profile';

const useStyles = makeStyles({
  profile: {
    position: 'relative',
    height: '90%',
    marginTop: '15px',
  },
});

interface IProps {
  match: FormattedMatch;
}

export const Match = ({ match }: IProps) => {
  const history = useHistory();
  const classes = useStyles();
  const [t] = useTranslation();
  const [showProfile, setShowProfile] = useState(false);

  const handleMessage = () => {
    history.push(`/messages/new/${match.phoneNumber}`);
  };

  const handleProfile = () => {
    setShowProfile((show) => !show);
  };

  const secondaryText = t('APPS_MATCH_PROFILE_MATCHED_AT', {
    matchedAt: match.matchedAtFormatted,
  });

  return (
    <>
      <ListItem divider>
        <ListItemText primary={match.name} secondary={secondaryText} />
        <Button onClick={handleProfile}>
          <PersonIcon />
        </Button>
        <Button onClick={handleMessage}>
          <ChatIcon />
        </Button>
      </ListItem>
      {showProfile && (
        <Box className={classes.profile}>
          <Profile profile={match} />
        </Box>
      )}
    </>
  );
};

export default Match;
