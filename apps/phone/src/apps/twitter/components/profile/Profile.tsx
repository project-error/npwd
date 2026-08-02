import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useProfile } from '../../hooks/useProfile';
import ProfileUpdateButton from '../buttons/ProfileUpdateButton';
import { usePhone } from '@os/phone/hooks/usePhone';
import { TwitterEvents } from '@typings/twitter';
import ProfileField from '../../../../ui/components/ProfileField';
import fetchNui from '../../../../utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useTwitterActions } from '../../hooks/useTwitterActions';
import { useLocation, useNavigate } from 'react-router';
import { useQueryParams } from '@common/hooks/useQueryParams';
import qs from 'qs';
import { ImagePlus } from 'lucide-react';

export function Profile() {
  const [t] = useTranslation();
  const { profile } = useProfile();
  const { ResourceConfig } = usePhone();
  const { addAlert } = useSnackbar();
  const navigate = useNavigate();
  const query = useQueryParams();
  const { pathname, search } = useLocation();

  const { updateLocalProfile } = useTwitterActions();

  const [avatarUrl, handleAvatarChange] = useState(
    profile.avatar_url || 'https://i.fivemanage.com/images/3ClWwmpwkFhL.png',
  );
  const [name, handleNameChange] = useState(profile.profile_name || '');

  const handleChooseImage = useCallback(() => {
    navigate(
      `/camera?${qs.stringify({
        referal: encodeURIComponent(pathname + search),
      })}`,
    );
  }, [navigate, pathname, search]);

  const handleUpdate = () => {
    const data = {
      avatar_url: avatarUrl,
      profile_name: name,
    };

    fetchNui<ServerPromiseResp>(TwitterEvents.UPDATE_PROFILE, data).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          message: t(resp.errorMsg),
          type: 'error',
        });
      }

      updateLocalProfile({ profile_name: name, avatar_url: avatarUrl });

      addAlert({
        message: t('TWITTER.FEEDBACK.EDIT_PROFILE_SUCCESS'),
        type: 'success',
      });
    });
  };

  useEffect(() => {
    if (!query?.image) return;
    handleAvatarChange(query.image);
  }, [query?.image, pathname, search, handleAvatarChange]);

  if (!ResourceConfig) return null;

  const { enableAvatars, allowEditableProfileName } = ResourceConfig.twitter;

  return (
    <div className="relative h-full w-full p-[15px]">
      {enableAvatars && (
        <div className="relative flex">
          <div
            className="group relative flex w-auto rounded-full bg-black"
            onClick={handleChooseImage}
          >
            <img
              src={avatarUrl}
              className="h-20 w-20 cursor-pointer rounded-full object-cover object-center hover:opacity-75"
              alt="profileimage"
            />
            <div className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 transform items-center justify-center group-hover:flex">
              <ImagePlus size={24} className="text-white" />
            </div>
          </div>
        </div>
      )}
      <div className="h-2" />

      <ProfileField
        label={t('TWITTER.EDIT_PROFILE_AVATAR')}
        value={avatarUrl}
        handleChange={handleAvatarChange}
        allowChange={enableAvatars}
      />
      <ProfileField
        label={t('TWITTER.EDIT_PROFILE_NAME')}
        value={name}
        handleChange={handleNameChange}
        allowChange={allowEditableProfileName}
      />
      <ProfileUpdateButton handleClick={handleUpdate} />
    </div>
  );
}

export default Profile;
