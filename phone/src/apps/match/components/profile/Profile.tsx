import React from 'react';
import { CardContent, CardMedia, Chip, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

import { FormattedProfile, FormattedMatch } from '../../../../../../typings/match';

const useStyles = makeStyles({
  tags: {
    position: 'absolute',
    bottom: '40%',
  },
  tag: {
    margin: '3px 3px 0px 0px',
    opacity: '0.8',
  },
  media: {
    height: '60%',
  },
  content: {
    height: '40%',
    overflowY: 'auto',
  },
});

interface IProps {
  profile: FormattedProfile | FormattedMatch;
}

const DEFAULT_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';

const Profile = ({ profile }: IProps) => {
  const c = useStyles();
  const { t } = useTranslation();

  function parseSecondaryBio(): string | undefined {
    const { location, job } = profile;
    if (location && job) {
      return `${location} - ${job}`;
    } else if (location) {
      return location;
    } else if (job) {
      return job;
    }
  }

  const bioSecondary = parseSecondaryBio();

  return (
    <>
      <CardContent className={c.tags}>
        {profile.tagList.map((tag) => (
          <Chip className={c.tag} label={tag} color="primary" />
        ))}
      </CardContent>
      <CardMedia className={c.media} image={profile.image || DEFAULT_IMAGE} title={profile.name} />
      <CardContent className={c.content}>
        <Typography gutterBottom variant="h4" component="h2">
          {profile.name}
        </Typography>
        <Typography gutterBottom color="textSecondary" component="p">
          {t('APPS_MATCH_PROFILE_LAST_ACTIVE', { lastActive: profile.lastActiveFormatted })}
        </Typography>
        {bioSecondary && (
          <Typography gutterBottom variant="body1" color="textSecondary" component="p">
            {bioSecondary}
          </Typography>
        )}
        <Typography variant="body2" color="textSecondary" component="p">
          {profile.bio}
        </Typography>
      </CardContent>
    </>
  );
};

export default Profile;
