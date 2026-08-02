import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Profile as IProfile, FormattedProfile, MatchEvents } from '@typings/match';
import ProfileField from '@ui/components/ProfileField';
import UpdateButton from '@ui/components/UpdateButton';
import Profile from './Profile';
import { usePhone } from '@os/phone/hooks/usePhone';
import PageText from '../PageText';
import fetchNui from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { useSetMyProfile } from '../../hooks/state';
import { Button } from '@ui/components/Button';
import { useLocation, useNavigate } from 'react-router';
import qs from 'qs';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { deleteQueryFromLocation } from '@common/utils/deleteQueryFromLocation';
import { Mic, Play, Pause } from 'lucide-react';
import { useAudioPlayer } from '@os/audio/hooks/useAudioPlayer';
import RecordVoiceMessage from '../RecordVoiceMessage';
import Backdrop from '@ui/components/Backdrop';
import { blobToBase64 } from '@utils/seralize';
import { AudioEvents, AudioRequest, AudioResponse } from '@typings/audio';
import { NPWDButton } from '@npwd/keyos';
import { cn } from '@utils/css';

interface IProps {
  profile: FormattedProfile;
  showPreview: boolean;
}

const AudioProgress = ({ value, indeterminate }: { value: number; indeterminate?: boolean }) => (
  <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
    <div
      className={cn(
        'h-full bg-[color:var(--keyos-app-accent)] transition-all',
        indeterminate && 'w-1/3 animate-pulse',
      )}
      style={indeterminate ? undefined : { width: `${value}%` }}
    />
  </div>
);

export function ProfileForm({ profile, showPreview }: IProps) {
  const [t] = useTranslation();
  const { ResourceConfig } = usePhone();
  const { addAlert } = useSnackbar();
  const setMyProfile = useSetMyProfile();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const query = useQueryParams();

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

  const handleSetVoiceMessage = (nextVoiceMessage: Blob) => {
    setVoiceMessage(nextVoiceMessage);
  };

  const calculateProgress =
    isNaN(duration) || duration == Infinity
      ? 0
      : (Math.trunc(currentTime) / Math.trunc(duration)) * 100;

  const handleOpenGallery = useCallback(() => {
    navigate(`/camera?${qs.stringify({ referal: encodeURIComponent(pathname + search) })}`);
  }, [navigate, pathname, search]);

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
    navigate(deleteQueryFromLocation({ pathname, search }, 'image'), { replace: true });
  }, [query, navigate, setImage, pathname, search]);

  if (!profile && !ResourceConfig.match.allowEditableProfileName) {
    return <PageText text={t('MATCH.PROFILE_CONFIGURATION')} />;
  }

  if (showPreview) {
    return (
      <div className="absolute m-[15px_15px_25px_15px] h-[calc(100%-80px)] w-[calc(100%-30px)] overflow-hidden rounded-xl bg-keyos-panel shadow-lg">
        <Profile profile={update} />
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100%-40px)] w-full p-[15px]">
      <RecordVoiceMessage
        open={recordVoiceMessage}
        closeModal={closeVoiceMessageModal}
        setVoiceMessage={handleSetVoiceMessage}
      />
      {recordVoiceMessage && <Backdrop />}
      <div>
        <ProfileField
          label={t('MATCH.EDIT_PROFILE_IMAGE')}
          value={update.image}
          handleChange={setImage}
          allowChange
        />
        <div className="mb-2 mt-1">
          <Button variant="contained" onClick={handleOpenGallery}>
            Choose image
          </Button>
        </div>
      </div>
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
          <p className="mt-2 text-sm text-keyos-muted">{t('MATCH.EDIT_VOICE_MESSAGE')}</p>

          <div className="flex flex-row items-center">
            <NPWDButton size="icon" variant="ghost" onClick={() => setRecordVoiceMessage(true)}>
              <Mic size={20} />
            </NPWDButton>

            {profile.voiceMessage && (
              <div className="w-full">
                <div className="flex items-center">
                  <NPWDButton size="icon" variant="ghost" onClick={playing ? pause : play}>
                    {playing ? <Pause size={20} /> : <Play size={20} />}
                  </NPWDButton>
                  <div className="w-[60%]">
                    {!calculateProgress && playing ? (
                      <AudioProgress value={0} indeterminate />
                    ) : (
                      <AudioProgress value={calculateProgress} />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <UpdateButton handleClick={handleUpdate} />
    </div>
  );
}

export default ProfileForm;
