import React, { useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import { useNuiRequest } from 'fivem-nui-react-lib';
import { useProfile } from '../../hooks/useProfile';
import Avatar from '../Avatar';
import ProfileUpdateButton from '../buttons/ProfileUpdateButton';
import { usePhone } from '../../../../os/phone/hooks/usePhone';
import { TwitterEvents } from '../../../../../../typings/twitter';
import ProfileField from '../../../../ui/components/ProfileField';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    width: '100%',
    height: '100%',
    padding: '15px',
  },
  spacer: {
    height: '8px',
  },
}));

export function Profile() {
  const Nui = useNuiRequest();
  const classes = useStyles();
  const { t } = useTranslation();
  const { profile } = useProfile();
  const { ResourceConfig } = usePhone();

  // note that this assumes we are defensively checking
  // that profile is not null in a parent above this component.
  // Annoyingling adding conditionals above this line to not render
  // when profile === null results in a react error that different
  // amounts of hooks are rendering
  const [avatarUrl, handleAvatarChange] = useState(profile.avatar_url || '');
  const [name, handleNameChange] = useState(profile.profile_name || '');
  const [bio, handleBioChange] = useState(profile.bio || '');
  const [location, handleLocationChange] = useState(profile.location || '');
  const [job, handleJobChange] = useState(profile.job || '');

  const handleUpdate = () => {
    const data = {
      avatar_url: avatarUrl,
      profile_name: name,
      bio,
      location,
      job,
    };
    Nui.send(TwitterEvents.UPDATE_PROFILE, data);
  };

  // fetching the config is an asynchronous call so defend against it
  if (!ResourceConfig) return null;

  const { enableAvatars, allowEditableProfileName } = ResourceConfig.twitter;

  return (
    <div className={classes.root}>
      {enableAvatars && <Avatar avatarUrl={avatarUrl} showInvalidImage />}
      <div className={classes.spacer} />
      <ProfileField
        label={t('APPS_TWITTER_EDIT_PROFILE_AVATAR')}
        value={avatarUrl}
        handleChange={handleAvatarChange}
        allowChange={enableAvatars}
      />
      <ProfileField
        label={t('APPS_TWITTER_EDIT_PROFILE_NAME')}
        value={name}
        handleChange={handleNameChange}
        allowChange={allowEditableProfileName}
      />
      <ProfileField
        label={t('APPS_TWITTER_EDIT_PROFILE_BIO')}
        value={bio}
        handleChange={handleBioChange}
        multiline
      />
      <ProfileField
        label={t('APPS_TWITTER_EDIT_PROFILE_LOCATION')}
        value={location}
        handleChange={handleLocationChange}
      />
      <ProfileField
        label={t('APPS_TWITTER_EDIT_PROFILE_JOB')}
        value={job}
        handleChange={handleJobChange}
      />
      <ProfileUpdateButton handleClick={handleUpdate} />
    </div>
  );
}

export default Profile;
