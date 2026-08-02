import React from 'react';
import { useTranslation } from 'react-i18next';
import ProfileUpdateButton from '../buttons/ProfileUpdateButton';

interface DefaultProfilePromptProps {
  handleUpdate: () => void;
  profileName: string;
  setProfileName: (name: string) => void;
  defaultProfileNames: string[];
}

export const DefaultProfilePrompt: React.FC<DefaultProfilePromptProps> = ({
  profileName,
  setProfileName,
  handleUpdate,
  defaultProfileNames,
}) => {
  const [t] = useTranslation();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    event.preventDefault();
    setProfileName(event.target.value);
  };

  return (
    <div className="relative h-full w-full p-[15px]">
      <label htmlFor="profile-name" className="mb-2 block text-sm text-keyos-muted">
        {t('TWITTER.EDIT_DEFAULT_PROFILE_NAME')}
      </label>
      <select
        id="profile-name"
        name="profileName"
        value={profileName}
        onChange={handleChange}
        className="w-full rounded-md border border-white/10 bg-keyos-panel px-3 py-2 text-keyos-cream outline-none focus:ring-2 focus:ring-[color:var(--keyos-app-accent)]"
      >
        {defaultProfileNames.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      <ProfileUpdateButton handleClick={handleUpdate} />
    </div>
  );
};

export default DefaultProfilePrompt;
