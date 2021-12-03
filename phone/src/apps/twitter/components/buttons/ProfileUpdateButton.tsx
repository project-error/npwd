import React from 'react';

import UpdateButton from '@ui/components/UpdateButton';

interface IProps {
  handleClick: () => void;
}

export function ProfileUpdateButton({ handleClick }: IProps) {
  return <UpdateButton handleClick={handleClick} />;
}

export default ProfileUpdateButton;
