import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileField from '../../../../ui/components/ProfileField';
import { useProfile } from '../../hooks/useProfile';
import ProfileUpdateButton from '../buttons/ProfileUpdateButton';
import { useDefaultProfileNamesValue, useSetTwitterProfile } from '../../hooks/state';
import { usePhone } from '@os/phone/hooks/usePhone';
import { Profile, TwitterEvents } from '@typings/twitter';
import DefaultProfilePrompt from './DefaultProfilePrompt';
import { ServerPromiseResp } from '@typings/common';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import fetchNui from '@utils/fetchNui';

export function ProfilePrompt() {
  const [t] = useTranslation();
  const { profile } = useProfile();
  const setTwitterProfile = useSetTwitterProfile();
  const defaultProfileNames = useDefaultProfileNamesValue();
  const [profileName, setProfileName] = useState(profile?.profile_name || '');
  const { ResourceConfig } = usePhone();
  const { addAlert } = useSnackbar();

  const showDefaultProfileNames = !ResourceConfig.twitter.allowEditableProfileName;

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

  return (
    <div className="relative h-full w-full p-[15px]">
      <ProfileField
        label={t('TWITTER.EDIT_PROFILE_NAME')}
        value={profileName}
        handleChange={setProfileName}
        allowChange
      />
      <ProfileUpdateButton handleClick={handleCreate} />
    </div>
  );
}

export default ProfilePrompt;
