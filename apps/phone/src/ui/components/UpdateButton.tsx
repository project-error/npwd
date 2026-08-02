import React from 'react';
import { NPWDButton } from '@npwd/keyos';
import { Upload } from 'lucide-react';

interface ProfileUpdateButtonProps {
  handleClick: () => void;
}

export const ProfileUpdateButton: React.FC<ProfileUpdateButtonProps> = ({ handleClick }) => {
  return (
    <div className="absolute bottom-[15px] right-[15px]">
      <NPWDButton aria-label="Update profile" onClick={handleClick} size="icon" variant="primary">
        <Upload className="size-5" />
      </NPWDButton>
    </div>
  );
};

export default ProfileUpdateButton;
