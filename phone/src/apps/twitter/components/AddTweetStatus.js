import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { useTranslation } from "react-i18next";

import { useTweetStatus } from "../hooks/useTweetStatus";

const HIDE_SUCCESS_TIMEOUT = 5000;

function AddTweetStatus() {
  const { isSuccessful } = useTweetStatus();
  const { t } = useTranslation();

  // on the "true" case the tweet was created and the user should
  // see their tweet at the top of the list, so there's no need
  // to directly prompt them that it was successful.
  if (isSuccessful === null || isSuccessful === true) return null;

  return <div>{t("APPS_TWITTER_CREATE_FAILED")}</div>;
}

export default AddTweetStatus;
