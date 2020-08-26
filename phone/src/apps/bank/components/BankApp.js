import React from "react";
import { makeStyles } from "@material-ui/core";
import { AppTitle } from "../../../ui/components/AppTitle";
import { AppWrapper } from "../../../ui/components";
import { AppContent } from "../../../ui/components/AppContent";
import { useTranslation } from "react-i18next";
import { Button } from "@material-ui/core";
import { useBank } from "../hooks/useBank";
import { TransactionList } from "./TransactionList";
import "./BankApp.css";
import { useApp } from "../../../os/apps/hooks/useApps";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "90px",
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#fb8c00",
    alignItems: "center",
  },
  header: {
    fontFamily: "'Bebas Neue', cursive",
    textAlign: "center",
    fontSize: 50,
  },
  bankOptions: {},
  bankOptionsButton: {
    display: "block",
    textAlign: "center",
  },
}));

export const BankApp = () => {
  const { transactionList } = useBank();
  const { t } = useTranslation();
  const classes = useStyles();
  const bank = useApp("BANK");
  return (
    <AppWrapper>
      <AppTitle {...bank} className={classes.root} />
      <AppContent>
        <div className={classes.bankOptions}>
          <Button className={classes.bankOptionsButton}>
            {t("APPS_BANK_DEPOSIT")}
          </Button>
          <Button className={classes.bankOptionsButton}>
            {t("APPS_BANK_WITHDRAW")}
          </Button>
          <Button className={classes.bankOptionsButton}>
            {t("APPS_BANK_TRANSFER")}
          </Button>
        </div>
        <TransactionList transactions={transactionList} />
      </AppContent>
    </AppWrapper>
  );
};
