import React from "react";
import { makeStyles } from "@material-ui/core";
import { BankTitle } from './BankTitle';
import { AppWrapper } from "../../../ui/components";
import { AppContent } from "../../../ui/components/AppContent";
import { Button } from "../../../ui/components/Button";
import { useTranslation } from "react-i18next";
import { useTransactions } from "../hooks/useTransactions";
import { TransactionList } from './transactions/TransactionList';
import "./BankApp.css";
import { useApp } from "../../../os/apps/hooks/useApps";
import { TransferModal } from './transfers/TransferModal';

import { useBankModal } from '../hooks/useBankModal';
import { useModal } from "../../twitter/hooks/useModal";


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
  backgroundModal: {
    background: "black",
    opacity: "0.6",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
}));

export const BankApp = () => {

  const { showBankModal, setShowBankModal } = useBankModal()

  const { transactionList } = useTransactions();
  const { t } = useTranslation();
  const classes = useStyles();


  const openTransactionsModal = () => {
    setShowBankModal(true)
  }

  return (
    <AppWrapper>
      <BankTitle />
      <TransferModal />
      <div className={showBankModal ? classes.backgroundModal : undefined} />
      <AppContent>
        <div>
          <Button onClick={openTransactionsModal} fullWidth>{t("APPS_BANK_TRANSFER")}</Button>
        </div>
        <TransactionList transactions={transactionList}/>
      </AppContent>
    </AppWrapper>
  );
};
