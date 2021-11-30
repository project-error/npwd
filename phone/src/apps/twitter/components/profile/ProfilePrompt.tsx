import React, { useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import ProfileField from '../../../../ui/components/ProfileField';
import { useProfile } from '../../hooks/useProfile';
import ProfileUpdateButton from '../buttons/ProfileUpdateButton';
import { useRecoilValue } from 'recoil';
import { twitterState, useSetTwitterProfile } from '../../hooks/state';
import { usePhone } from '../../../../os/phone/hooks/usePhone';
import { Profile, TwitterEvents } from '../../../../../../typings/twitter';
import DefaultProfilePrompt from './DefaultProfilePrompt';
import { fetchNui } from '../../../../utils/fetchNui';
import { ServerPromiseResp } from '../../../../../../typings/common';
import { useSnackbar } from '../../../../ui/hooks/useSnackbar';

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

export function ProfilePrompt() {
  const classes = useStyles();
  const [t] = useTranslation();
  const { profile } = useProfile();
  const setTwitterProfile = useSetTwitterProfile();
  const defaultProfileNames = useRecoilValue(twitterState.defaultProfileNames);
  const [profileName, setProfileName] = useState(profile?.profile_name || '');
  const { ResourceConfig } = usePhone();
  const { addAlert } = useSnackbar();

  const showDefaultProfileNames = !profile || !ResourceConfig.twitter.allowEditableProfileName;

  const handleCreate = async () => {
    fetchNui<ServerPromiseResp<Profile>>(TwitterEvents.CREATE_PROFILE, {
      profile_name: profileName,
    }).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          message: 'Failed to update profile',
          type: 'error',
        });
      }

      setTwitterProfile(resp.data);
    });
  };

  const handleUpdate = async () => {
    fetchNui<ServerPromiseResp<Profile>>(TwitterEvents.UPDATE_PROFILE, {
      ...profile,
      profile_name: profileName,
    }).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          message: 'Failed to update profile',
          type: 'error',
        });
      }

      setTwitterProfile(resp.data);
    });
  };

  // case where profile doesn't exist, couldn't be created automatically
  // and the player is not allowed to edit their own profile name
  if (showDefaultProfileNames) {
    return (
      <DefaultProfilePrompt
        profileName={profileName}
        defaultProfileNames={defaultProfileNames}
        setProfileName={setProfileName}
        handleUpdate={handleCreate}
      />
    );
  }

  // case where profile doesn't exist, couldn't be created automatically
  // but the player IS allowed to edit their own profile name
  return (
    <div className={classes.root}>
      <ProfileField
        label={t('APPS_TWITTER_EDIT_PROFILE_NAME')}
        value={profileName}
        handleChange={setProfileName}
        allowChange
      />
      <ProfileUpdateButton handleClick={handleUpdate} />
    </div>
  );
}

export default ProfilePrompt;
