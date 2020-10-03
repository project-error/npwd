import React from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

import { useTweetStatus } from "../../hooks/useTweetStatus";

const useStyles = makeStyles((theme) => ({
  buttons: {
    display: "flex",
    flexFlow: "row nowrap",
    justifyContent: "flex-end",
    alignItems: "justify-content",
    marginRight: "15px",
  },
  close: {
    marginLeft: "8px",
  },
}));

export const ControlButtons = ({
  showImagePrompt,
  showEmoji,
  onCloseClick,
  onPrimaryClick,
}) => {
  const { createTweetLoading } = useTweetStatus();

  const classes = useStyles();
  const { t } = useTranslation();

  const imagePromptVisible = showImagePrompt && !showEmoji;
  const primaryButtonText = imagePromptVisible
    ? t("APPS_TWITTER_SUBMIT_IMAGE")
    : t("APPS_TWITTER_TWEET");
  const showCloseButton = showImagePrompt || showEmoji;

  if (createTweetLoading) return <h1>!!!</h1>;

  return (
    <div className={classes.buttons}>
      <Button variant="contained" color="primary" onClick={onPrimaryClick}>
        {primaryButtonText}
      </Button>
      {showCloseButton && (
        <Button
          className={classes.close}
          variant="contained"
          color="secondary"
          onClick={onCloseClick}
        >
          {t("APPS_TWITTER_CLOSE_IMAGE")}
        </Button>
      )}
    </div>
  );
};

export default ControlButtons;
