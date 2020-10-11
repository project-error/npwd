import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";

import Nui from "../../../../os/nui-events/utils/Nui";
import { useProfile } from "../../hooks/useProfile";
import ProfileField from "./ProfileField";
import ProfileUpdateButton from "../buttons/ProfileUpdateButton";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
    width: "100%",
    height: "100%",
    padding: "15px",
  },
  spacer: {
    height: "8px",
  },
}));

export function ProfilePrompt() {
  const classes = useStyles();
  const { t } = useTranslation();
  const { profile } = useProfile();

  const [name, handleNameChange] = useState(profile.profile_name || "");

  const handleUpdate = () => {
    const data = {
      ...profile,
      profile_name: name,
    };
    Nui.send("phone:updateTwitterProfile", data);
  };

  return (
    <div className={classes.root}>
      <ProfileField
        label={t("APPS_TWITTER_EDIT_PROFILE_NAME")}
        value={name}
        handleChange={handleNameChange}
        allowChange
      />
      <ProfileUpdateButton handleClick={handleUpdate} />
    </div>
  );
}

export default ProfilePrompt;
