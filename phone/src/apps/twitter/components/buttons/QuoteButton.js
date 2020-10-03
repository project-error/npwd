import React from "react";
import { useSetRecoilState } from "recoil";
import { Button } from "@material-ui/core";
import QuoteIcon from "@material-ui/icons/FormatQuote";

import { twitterState } from "../../hooks/state";

export const QuoteButton = ({ message }) => {
  const setModalVisible = useSetRecoilState(twitterState.showCreateTweetModal);
  const setMessage = useSetRecoilState(twitterState.modalMessage);

  const handleClick = () => {
    setMessage(`> ${message}

`);
    setModalVisible(true);
  };

  return (
    <Button onClick={handleClick}>
      <QuoteIcon />
    </Button>
  );
};

export default QuoteButton;
