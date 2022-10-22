import React, { useCallback, useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import { Profile as IProfile, FormattedProfile, MatchEvents } from '@typings/match';
import ProfileField from '@ui/components/ProfileField';
import UpdateButton from '@ui/components/UpdateButton';
import { Box, Card, IconButton, LinearProgress, Stack, Typography } from '@mui/material';
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
import MicIcon from '@mui/icons-material/Mic';
import { useAudioPlayer } from '@os/audio/hooks/useAudioPlayer';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RecordVoiceMessage from '../RecordVoiceMessage';
import Backdrop from '@ui/components/Backdrop';
import { blobToBase64 } from '@utils/seralize';
import { AudioEvents, AudioRequest, AudioResponse } from '@typings/audio';

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
  const [voiceMessage, setVoiceMessage] = useState<Blob | null>(null);
  const [recordVoiceMessage, setRecordVoiceMessage] = useState(false);
  const { play, pause, playing, currentTime, duration } = useAudioPlayer(profile.voiceMessage);

  const closeVoiceMessageModal = () => {
    setRecordVoiceMessage((curVal) => !curVal);
  };

  const handleSetVoiceMessage = (voiceMessage: Blob) => {
    setVoiceMessage(voiceMessage);
  };

  const calculateProgress =
    isNaN(duration) || duration == Infinity
      ? 0
      : (Math.trunc(currentTime) / Math.trunc(duration)) * 100;

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

  const handleUpdate = async () => {
    let voiceMessageURL: string | null = null;

    if (voiceMessage && voiceMessage.size) {
      const b64 = await blobToBase64(voiceMessage);

      await fetchNui<ServerPromiseResp<AudioResponse>, AudioRequest>(AudioEvents.UPLOAD_AUDIO, {
        file: b64,
        size: voiceMessage.size,
      }).then((audioRes) => {
        if (audioRes.status !== 'ok') {
          return addAlert({
            type: 'error',
            message: audioRes.errorMsg,
          });
        }
        voiceMessageURL = audioRes.data.url;
      });
    }

    const updatedProfile: IProfile = {
      ...update,
      name: update.name.trim(),
      image: update.image.trim(),
      tags: update.tagList.join(','),
      voiceMessage: voiceMessageURL,
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
      <RecordVoiceMessage
        open={recordVoiceMessage}
        closeModal={closeVoiceMessageModal}
        setVoiceMessage={handleSetVoiceMessage}
      />
      {recordVoiceMessage && <Backdrop />}
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

      {ResourceConfig && ResourceConfig.voiceMessage && (
        <>
          <Typography variant="body2" color="textSecondary" component="p" sx={{ marginTop: '8px' }}>
            {t('MATCH.EDIT_VOICE_MESSAGE')}
          </Typography>

          <Stack direction="row">
            <IconButton onClick={() => setRecordVoiceMessage(true)}>
              <MicIcon />
            </IconButton>

            {profile.voiceMessage && (
              <Box sx={{ width: '100%' }}>
                <Box display="flex" alignItems="center">
                  <IconButton onClick={playing ? pause : play}>
                    {playing ? <PauseIcon /> : <PlayArrowIcon />}
                  </IconButton>
                  <Box sx={{ width: '60%' }}>
                    {!calculateProgress && playing ? (
                      <LinearProgress />
                    ) : (
                      <LinearProgress variant="determinate" value={calculateProgress} />
                    )}
                  </Box>
                </Box>
              </Box>
            )}
          </Stack>
        </>
      )}

      <UpdateButton handleClick={handleUpdate} />
    </div>
  );
}

export default ProfileForm;
