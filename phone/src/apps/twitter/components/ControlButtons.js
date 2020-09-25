import React from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

import { useTweetStatus } from "../hooks/useTweetStatus";

const useStyles = makeStyles((theme) => ({
  buttons: {
    display: "flex",
    flexFlow: "row nowrap",
    justifyContent: "flex-end",
    alignItems: "justify-content",
    marginRight: "15px",
  },
  closeMedia: {
    marginLeft: "8px",
  },
}));

export const ControlButtons = ({
  mediaType,
  showEmoji,
  onCloseClick,
  onPrimaryClick,
}) => {
  const { isLoading } = useTweetStatus();

  const classes = useStyles();
  const { t } = useTranslation();

  const mediaPromptVisible = mediaType && !showEmoji;
  const primaryButtonText = mediaPromptVisible
    ? t("APPS_TWITTER_SUBMIT_MEDIA")
    : t("APPS_TWITTER_TWEET");
  const showCloseButton = mediaType || showEmoji;

  if (isLoading) return <h1>!!!</h1>;

  return (
    <div className={classes.buttons}>
      <Button variant="contained" color="primary" onClick={onPrimaryClick}>
        {primaryButtonText}
      </Button>
      {showCloseButton && (
        <Button
          className={classes.closeMedia}
          variant="contained"
          color="secondary"
          onClick={onCloseClick}
        >
          {t("APPS_TWITTER_CLOSE_MEDIA")}
        </Button>
      )}
    </div>
  );
};

export default ControlButtons;
