import React, { useState } from "react";
import {
  Paper,
  Slide,
  Button,
  TextField,
  Avatar as MuiAvatar,
} from "@material-ui/core";
import useStyles from "./modal.styles";
import { useContactModal } from "../../hooks/useContactModal";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import { useTranslation } from "react-i18next";
import { useContactDetail } from "../../hooks/useContactDetail";
import Nui from "../../../../os/nui-events/utils/Nui";

export const InfoModal = () => {
  const classes = useStyles();
  const { showContactModal, setShowContactModal } = useContactModal();
  const { t } = useTranslation();
  const { contactDetail, setContactDetail } = useContactDetail();

  const [display, setDisplay] = useState(
    contactDetail ? contactDetail.display : ""
  );
  console.log(contactDetail);
  const [number, setNumber] = useState(
    contactDetail ? contactDetail.number : ""
  );
  const [avatar, setAvatar] = useState(
    contactDetail ? contactDetail.avatar : ""
  );

  const closeModal = () => {
    setShowContactModal(false);
    setContactDetail(null);
  };

  const updateContact = () => {
    Nui.send("phone:updateContact", {
      id: contactDetail.id,
      display,
      number,
      avatar,
    });
    setContactDetail(null);
    setShowContactModal(false);
  };

  const deleteContact = () => {
    Nui.send("phone:deleteContact", {
      id: contactDetail.id,
    });
    setContactDetail(null);
    setShowContactModal(false);
  };

  return (
    <Slide direction="up" in={showContactModal}>
      <Paper
        className={showContactModal ? classes.modalRoot : classes.modalHide}
      >
        <Button style={{ margin: 10 }} onClick={closeModal}>
          <ArrowBackIcon fontSize="large" />
        </Button>
        <div className={classes.listContainer}>
          <MuiAvatar className={classes.avatar} src={avatar} />
          <TextField
            className={classes.input}
            value={display}
            onChange={(e) => setDisplay(e.target.value)}
            placeholder={t("APPS_CONTACT_FORM_NAME")}
            fullWidth
            inputProps={{
              className: classes.inputProps,
            }}
          />
          <TextField
            className={classes.input}
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder={t("APPS_CONTACT_FORM_NUMBER")}
            fullWidth
            inputProps={{
              className: classes.inputProps,
            }}
          />
          <TextField
            className={classes.input}
            placeholder={t("APPS_CONTACT_FORM_AVATAR")}
            fullWidth
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            inputProps={{
              className: classes.inputProps,
            }}
          />

          <div style={{ display: "block" }}>
            <Button onClick={updateContact} className={classes.updateButton}>
              Update
            </Button>
            <Button onClick={deleteContact} className={classes.deleteButton}>
              Delete
            </Button>
          </div>
        </div>
      </Paper>
    </Slide>
  );
};
