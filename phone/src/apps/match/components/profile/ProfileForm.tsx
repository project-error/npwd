import React, { useCallback, useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import { Profile as IProfile, FormattedProfile, MatchEvents } from '@typings/match';
import ProfileField from '@ui/components/ProfileField';
import UpdateButton from '@ui/components/UpdateButton';
import { Box, Card } from '@mui/material';
import Profile from './Profile';
import { usePhone } from '@os/phone/hooks/usePhone';
import PageText from '../PageText';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useSetMyProfile } from '../../hooks/state';
import { Button } from '@ui/components/Button';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'qs';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { deleteQueryFromLocation } from '@common/utils/deleteQueryFromLocation';

const useStyles = makeStyles({
  root: {
    position: 'relative',
    width: '100%',
    height: 'calc(100% - 40px)',
    padding: '15px',
  },
  card: {
    position: 'absolute',
    margin: '15px 15px 25px 15px',
    height: 'calc(100% - 80px)',
    width: 'calc(100% - 30px)',
    overflow: 'hidden',
  },
  spacer: {
    height: '8px',
  },
});

interface IProps {
  profile: FormattedProfile;
  showPreview: boolean;
}

export function ProfileForm({ profile, showPreview }: IProps) {
  const classes = useStyles();
  const [t] = useTranslation();
  const { ResourceConfig } = usePhone();
  const { addAlert } = useSnackbar();
  const setMyProfile = useSetMyProfile();
  const history = useHistory();
  const { pathname, search } = useLocation();
  const query = useQueryParams();

  // note that this assumes we are defensively checking
  // that profile is not null in a parent above this component.
  // Annoyingling adding conditionals above this line to not render
  // when profile === null results in a react error that different
  // amounts of hooks are rendering
  const [image, setImage] = useState(profile?.image || '');
  const [name, setName] = useState(profile?.name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [job, setJob] = useState(profile?.job || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [tags, setTags] = useState(profile?.tags || '');

  const handleOpenGallery = useCallback(() => {
    history.push(`/camera?${qs.stringify({ referal: encodeURIComponent(pathname + search) })}`);
  }, [history, pathname, search]);

  const update: FormattedProfile = {
    ...profile,
    image,
    name,
    bio,
    location,
    job,
    tagList: tags.split(',').map((tag) => tag.trim()),
  };

  const handleUpdate = () => {
    const updatedProfile: IProfile = {
      ...update,
      name: update.name.trim(),
      image: update.image.trim(),
      tags: update.tagList.join(','),
    };
    const event = profile ? MatchEvents.UPDATE_MY_PROFILE : MatchEvents.CREATE_MY_PROFILE;
    fetchNui<ServerPromiseResp<FormattedProfile>>(event, updatedProfile).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          message: t(resp.errorMsg),
          type: 'error',
        });
      }

      setMyProfile(resp.data);

      addAlert({
        message: t('MATCH.FEEDBACK.UPDATE_PROFILE_SUCCEEDED'),
        type: 'success',
      });
    });
  };

  useEffect(() => {
    if (!query?.image) return;
    setImage(query.image);
    history.replace(deleteQueryFromLocation({ pathname, search }, 'image'));
  }, [query, history, setImage, pathname, search]);

  if (!profile && !ResourceConfig.match.allowEditableProfileName) {
    return <PageText text={t('MATCH.PROFILE_CONFIGURATION')} />;
  }

  if (showPreview) {
    return (
      <Card raised className={classes.card}>
        <Profile profile={update} />
      </Card>
    );
  }

  return (
    <div className={classes.root}>
      <Box>
        <ProfileField
          label={t('MATCH.EDIT_PROFILE_IMAGE')}
          value={update.image}
          handleChange={setImage}
          allowChange
        />
        <Box mt={1} mb={2}>
          <Button variant="contained" onClick={handleOpenGallery}>
            Choose image
          </Button>
        </Box>
      </Box>
      <ProfileField
        label={t('MATCH.EDIT_PROFILE_NAME')}
        value={name}
        handleChange={setName}
        allowChange={ResourceConfig.match.allowEditableProfileName}
      />
      <ProfileField
        label={t('MATCH.EDIT_PROFILE_BIO')}
        value={update.bio}
        handleChange={setBio}
        multiline
        maxLength={250}
      />
      <ProfileField
        label={t('MATCH.EDIT_PROFILE_LOCATION')}
        value={update.location}
        handleChange={setLocation}
      />
      <ProfileField
        label={t('MATCH.EDIT_PROFILE_JOB')}
        value={update.job}
        handleChange={setJob}
        maxLength={50}
      />
      <ProfileField label={t('MATCH.EDIT_PROFILE_TAGS')} value={tags} handleChange={setTags} />
      <UpdateButton handleClick={handleUpdate} />
    </div>
  );
}

export default ProfileForm;
