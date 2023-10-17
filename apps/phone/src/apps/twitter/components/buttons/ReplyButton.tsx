import React from 'react';
import { useSetRecoilState } from 'recoil';
import { Button } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import { toggleKeys } from '@ui/components';
import { twitterState } from '../../hooks/state';

export const ReplyButton = ({ profile_name }) => {
  const setModalVisible = useSetRecoilState(twitterState.showCreateTweetModal);
  const setMessage = useSetRecoilState(twitterState.modalMessage);

  const handleClick = () => {
    setMessage(`@${profile_name} `);
    setModalVisible(true);
  };

  return (
    <Button
      onClick={handleClick}
      onMouseUp={() => {
        toggleKeys(false);
      }}
    >
      <ReplyIcon />
    </Button>
  );
};

export default ReplyButton;
