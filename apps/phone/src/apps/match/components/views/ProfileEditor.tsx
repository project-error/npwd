import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SwitchRoot, SwitchThumb } from '@npwd/keyos';
import Loader from '../Loader';
import ProfileForm from '../profile/ProfileForm';
import { useProfile } from '../../hooks/useProfile';

function ProfileEditor() {
  const { profile, noProfileExists } = useProfile();
  const [t] = useTranslation();
  const [showPreview, setShowPreview] = useState(false);

  const toggleSwitch = () => {
    setShowPreview((preview) => !preview);
  };

  if (!profile && !noProfileExists) return <Loader />;

  return (
    <div className="h-full w-full">
      <div className="ml-[15px] flex items-center gap-3">
        <SwitchRoot checked={showPreview} onCheckedChange={toggleSwitch}>
          <SwitchThumb />
        </SwitchRoot>
        <span className="text-keyos-fg">{t<string>('MATCH.EDIT_PROFILE_PREVIEW')}</span>
      </div>
      <ProfileForm showPreview={showPreview} profile={profile} />
    </div>
  );
}

export default ProfileEditor;
