import React from "react";
import Button from "@material-ui/core/Button";
import QuoteIcon from "@material-ui/icons/FormatQuote";

import { useModal } from "../hooks/useModal";

export const QuoteButton = ({ message }) => {
  const { setMessage, setModalVisible } = useModal();

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
