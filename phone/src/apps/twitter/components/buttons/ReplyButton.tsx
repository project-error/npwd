import React from 'react';
import { useSetRecoilState } from 'recoil';
import { Button } from '@material-ui/core';
import ReplyIcon from '@material-ui/icons/Reply';

import { twitterState } from '../../hooks/state';

export const ReplyButton = ({ profile_name }) => {
  const setModalVisible = useSetRecoilState(twitterState.showCreateTweetModal);
  const setMessage = useSetRecoilState(twitterState.modalMessage);

  const handleClick = () => {
    setMessage(`@${profile_name} `);
    setModalVisible(true);
  };

  return (
    <Button onClick={handleClick}>
      <ReplyIcon />
    </Button>
  );
};

export default ReplyButton;
