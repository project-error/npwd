import React from 'react';

import UpdateButton from '../../../../ui/components/UpdateButton';
import { useProfile } from '../../hooks/useProfile';

interface IProps {
  handleClick: () => void;
}

export function ProfileUpdateButton({ handleClick }: IProps) {
  const { updateProfileLoading } = useProfile();

  return <UpdateButton loading={updateProfileLoading} handleClick={handleClick} />;
}

export default ProfileUpdateButton;
