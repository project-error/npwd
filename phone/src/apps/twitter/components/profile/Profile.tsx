import React, { useCallback, useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import { useProfile } from '../../hooks/useProfile';
import Avatar from '../Avatar';
import ProfileUpdateButton from '../buttons/ProfileUpdateButton';
import { usePhone } from '@os/phone/hooks/usePhone';
import { TwitterEvents } from '@typings/twitter';
import ProfileField from '../../../../ui/components/ProfileField';
import fetchNui from '../../../../utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useTwitterActions } from '../../hooks/useTwitterActions';
import { useHistory, useLocation } from 'react-router-dom';
import { useQueryParams } from '@common/hooks/useQueryParams';
import qs from 'qs';
import { Box, Button } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';

const useStyles = makeStyles(() => ({
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
  const classes = useStyles();
  const [t] = useTranslation();
  const { profile } = useProfile();
  const { ResourceConfig } = usePhone();
  const { addAlert } = useSnackbar();
  const history = useHistory();
  const query = useQueryParams();
  const { pathname, search } = useLocation();

  const { updateLocalProfile } = useTwitterActions();

  // note that this assumes we are defensively checking
  // that profile is not null in a parent above this component.
  // Annoyingling adding conditionals above this line to not render
  // when profile === null results in a react error that different
  // amounts of hooks are rendering
  const [avatarUrl, handleAvatarChange] = useState(profile.avatar_url || '');
  const [name, handleNameChange] = useState(profile.profile_name || '');

  const handleChooseImage = useCallback(() => {
    history.push(
      `/camera?${qs.stringify({
        referal: encodeURIComponent(pathname + search),
      })}`,
    );
  }, [history, pathname, search]);

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
  }, [query?.image, history, pathname, search, handleAvatarChange]);

  // fetching the config is an asynchronous call so defend against it
  if (!ResourceConfig) return null;

  const { enableAvatars, allowEditableProfileName } = ResourceConfig.twitter;

  return (
    <div className={classes.root}>
      {enableAvatars && <Avatar avatarUrl={avatarUrl} showInvalidImage />}
      <div className={classes.spacer} />

      <Box display="flex" alignItems="center">
        <div>
          <ImageIcon />
        </div>
        <div>
          <Button onClick={handleChooseImage}>{t('TWITTER.AVATAR_CHOOSE_IMAGE')} xd</Button>
        </div>
      </Box>

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
