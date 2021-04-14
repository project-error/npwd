import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { useNuiRequest } from 'fivem-nui-react-lib';
import {
  Profile as IProfile,
  FormattedProfile,
  MatchEvents,
} from '../../../../../../typings/match';
import ProfileField from '../../../../ui/components/ProfileField';
import UpdateButton from '../../../../ui/components/UpdateButton';
import { Card } from '@material-ui/core';
import Profile from './Profile';
import { usePhone } from '../../../../os/phone/hooks/usePhone';
import PageText from '../PageText';

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
  const Nui = useNuiRequest();
  const classes = useStyles();
  const { t } = useTranslation();
  const { ResourceConfig } = usePhone();

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
    Nui.send(event, updatedProfile);
  };

  if (!profile && !ResourceConfig.match.allowEditableProfileName) {
    return <PageText text={t('APPS_MATCH_PROFILE_CONFIGURATION')} />;
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
      <ProfileField
        label={t('APPS_MATCH_EDIT_PROFILE_IMAGE')}
        value={update.image}
        handleChange={setImage}
        allowChange
      />
      <ProfileField
        label={t('APPS_MATCH_EDIT_PROFILE_NAME')}
        value={name}
        handleChange={setName}
        allowChange={ResourceConfig.match.allowEditableProfileName}
      />
      <ProfileField
        label={t('APPS_MATCH_EDIT_PROFILE_BIO')}
        value={update.bio}
        handleChange={setBio}
        multiline
      />
      <ProfileField
        label={t('APPS_MATCH_EDIT_PROFILE_LOCATION')}
        value={update.location}
        handleChange={setLocation}
      />
      <ProfileField
        label={t('APPS_MATCH_EDIT_PROFILE_JOB')}
        value={update.job}
        handleChange={setJob}
      />
      <ProfileField label={t('APPS_MATCH_EDIT_PROFILE_TAGS')} value={tags} handleChange={setTags} />
      <UpdateButton handleClick={handleUpdate} loading={false} />
    </div>
  );
}

export default ProfileForm;
