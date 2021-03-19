import React from 'react';
import { Box, CardContent, CardMedia, Chip, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

import { FormattedProfile } from '../../../../../../typings/match';

const useStyles = makeStyles({
  root: {},
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
  profile: FormattedProfile;
}

const Profile = ({ profile }: IProps) => {
  const c = useStyles();
  const { t } = useTranslation();

  const { location, job, tagList, image, lastActive, name, bio } = profile;

  let bioSecondary;
  if (location && job) {
    bioSecondary = `${profile.location} - ${profile.job}`;
  } else if (location) {
    bioSecondary = location;
  } else if (job) {
    bioSecondary = job;
  }

  return (
    <>
      <CardContent className={c.tags}>
        {profile.tagList.map((tag) => (
          <Chip className={c.tag} label={tag} color="primary" />
        ))}
      </CardContent>
      <CardMedia className={c.media} image={profile.image} title="Paella dish" />
      <CardContent className={c.content}>
        <Typography gutterBottom variant="h4" component="h2">
          {profile.name}
        </Typography>
        <Typography gutterBottom color="textSecondary" component="p">
          {t('APPS_MATCH_PROFILE_LAST_ACTIVE', { lastActive: profile.lastActive })}
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
