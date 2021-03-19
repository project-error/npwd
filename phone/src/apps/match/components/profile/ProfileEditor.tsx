import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Box, Card, FormControlLabel, Switch } from '@material-ui/core';

import { useProfile } from '../../hooks/useProfile';
import Loader from '../Loader';
import ProfileForm from './ProfileForm';
import Profile from './Profile';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    height: '100%',
    width: '100%',
  },
  switch: {
    marginLeft: '15px',
  },
}));

function ProfileEditor() {
  const { profile } = useProfile();
  const classes = useStyles();
  const { t } = useTranslation();
  const [showPreview, setShowPreview] = useState(false);

  const toggleSwitch = () => {
    setShowPreview((preview) => !preview);
  };

  if (!profile) return <Loader />;

  return (
    <Box className={classes.root}>
      <Box className={classes.switch}>
        <FormControlLabel
          control={<Switch checked={showPreview} onChange={toggleSwitch} />}
          label={t('APPS_MATCH_EDIT_PROFILE_PREVIEW')}
        />
      </Box>
      <ProfileForm showPreview={showPreview} profile={profile} />
    </Box>
  );
}

export default ProfileEditor;
