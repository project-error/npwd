import React from "react";
import { useTranslation } from "react-i18next";
import { makeStyles, Paper, Typography, Button } from "@material-ui/core";
import { useTransactions } from "../../hooks/useTransactions";
import { red } from "@material-ui/core/colors";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  header: {
    width: "90%",
    display: "flex",
    justifyItems: "center",
    justifyContent: "space-between",
    margin: "auto",
  },
  title: {
    padding: 7,
    borderRadius: "10px",
    display: "flex",
    justifyItems: "center",
    justifyContent: "center",
    fontSize: "24px",
  },
  seeAll: {
    fontFamily: "Bahnschrift Regular",
    fontWeight: "bold",
    height: 'auto'
  },
  transcationDiv: {
    marginTop: '-30px',
  },
  transactions: {
    marginLeft: "32px",
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "2px solid #707070",
    width: "85%",
    margin: "auto",
  },
  tranSource: {
    fontSize: "22px",
  },
  tranType: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#BFBFBF",
    marginTop: "-18px",
    width: "100%",
  },

  depositType: {
    color: "#55B452",
    marginRight: "32px",
    fontSize: "22px",
    fontWeight: "bold",
  },
  withdrawType: {
    color: "#FF5E5E",
    marginRight: "32px",
    fontSize: "22px",
    fontWeight: "bold",
  },
}));

export const AccountTransactions = (): any => {
  const classes = useStyles();

  const TransactionTypes = {
    Deposit: classes.depositType,
    Withdraw: classes.withdrawType,
    Transfer: classes.depositType
  };

  const { transactionList } = useTransactions();
  const { t } = useTranslation();
  return (
    <div id="account-section">
      <div className={classes.header}>
        <h2 className={classes.title}>{t("APPS_BANK_ACCOUNT_TRANSACTIONS")}</h2>
        <Button className={classes.seeAll}>
          {t("APPS_BANK_ACCOUNT_SEE_TRANSACTION")}
        </Button>
      </div>

      <div className={classes.transcationDiv}>
        {transactionList.slice(0, 3).map((transaction: any) => (
          <div className={classes.transactions}>
            <div>
              <h1 className={classes.tranSource}>{transaction.source}</h1>
              <p className={classes.tranType}>{transaction.type}</p>
            </div>
            <div>
              <p className={TransactionTypes[transaction.type]}>
                {transaction.type == "Withdraw" ? "-" : "+"}
                {transaction.amount}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
