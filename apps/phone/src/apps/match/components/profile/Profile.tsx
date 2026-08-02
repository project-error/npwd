import React from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Pause } from 'lucide-react';
import { NPWDButton } from '@npwd/keyos';
import { FormattedProfile, FormattedMatch } from '@typings/match';
import { useAudioPlayer } from '@os/audio/hooks/useAudioPlayer';
import { cn } from '@utils/css';

interface IProps {
  profile: FormattedProfile | FormattedMatch;
}

const DEFAULT_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';

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

const Profile = ({ profile }: IProps) => {
  const [t] = useTranslation();
  const { play, pause, playing, currentTime, duration } = useAudioPlayer(profile.voiceMessage);

  const calculateProgress =
    isNaN(duration) || duration == Infinity
      ? 0
      : (Math.trunc(currentTime) / Math.trunc(duration)) * 100;

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
      <div className="absolute bottom-[40%]">
        {profile.tagList.map((tag) => (
          <span
            key={tag}
            className="mr-[3px] mt-[3px] inline-block rounded-full bg-[color:var(--keyos-app-accent)]/80 px-2 py-0.5 text-xs text-white opacity-80"
          >
            {tag}
          </span>
        ))}
      </div>
      <img
        className="h-[60%] w-full object-cover"
        src={profile.image || DEFAULT_IMAGE}
        alt={profile.name}
      />
      <div className="h-[40%] overflow-y-auto p-4">
        <h2 className="mb-2 text-2xl font-semibold text-keyos-cream">{profile.name}</h2>
        <p className="mb-2 text-keyos-muted">
          {t('MATCH.MESSAGES.PROFILE_LAST_ACTIVE', { lastActive: profile.lastActiveFormatted })}
        </p>
        {bioSecondary && <p className="mb-2 text-keyos-muted">{bioSecondary}</p>}
        <p className="text-sm text-keyos-muted">{profile.bio}</p>

        {profile.voiceMessage && (
          <div className="mt-3">
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
  );
};

export default Profile;
