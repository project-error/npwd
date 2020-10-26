import React from "react";
import { makeStyles, Paper, Typography } from "@material-ui/core";
import { BankTitle } from "../BankTitle";
import { Button } from "../../../../ui/components/Button";
import { useTranslation } from "react-i18next";
import { useTransactions } from "../../hooks/useTransactions";
import { TransactionList } from "../transactions/TransactionList";
import { TransferModal } from "../transfers/TransferModal";

import { useBankModal } from "../../hooks/useBankModal";
import { useCredentials } from "../../hooks/useCredentials";

// image
import CreditCard from '../img/credit-card.png'

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%"
  }
}));

export const BankHome = () => {
  const { showBankModal, setShowBankModal } = useBankModal();
  const { credentials } = useCredentials();
  const { transactionList } = useTransactions();
  const { t } = useTranslation();
  const classes = useStyles();

  const openTransactionsModal = () => {
    setShowBankModal(true);
  };

  return (
    <div className={classes.root} >

    </div>
  );
};