import React from "react";
import Button from "@material-ui/core/Button";
import ReplyIcon from "@material-ui/icons/Reply";
import { useModal } from "../hooks/useModal";

export const ReplyButton = ({ profile_name }) => {
  const { setMessage, setModalVisible } = useModal();

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
