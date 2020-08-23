import React from 'react';
import { makeStyles } from '@material-ui/core';
import { AppTitle } from "../../../ui/components/AppTitle";
import { AppWrapper } from "../../../ui/components";
import { AppContent } from "../../../ui/components/AppContent";
import { useTranslation } from "react-i18next";
import { Button } from '@material-ui/core';
import './BankApp.css'

const useStyles = makeStyles((theme) => ({
    root: {
        height: '90px',
        display: 'flex',
        justifyContent: 'center', 
        backgroundColor: '#fb8c00',
        alignItems: 'center'
    },
    header: {
        fontFamily: "'Bebas Neue', cursive",
        textAlign: 'center',
        fontSize: 50
    },
    bankOptions: {
    },
    bankOptionsButton: {
        display: 'block',
        textAlign: 'center'
    }

}))

export const BankApp = () => {
    const { t } = useTranslation();
    const classes = useStyles();
    return (
        <AppWrapper>
            <AppTitle className={classes.root}>
                <h1 className={classes.header}>WhoDis Banking</h1>
            </AppTitle>
            <AppContent>
                <div className={classes.bankOptions}>
                    <Button className={classes.bankOptionsButton}>{t("APPS_BANK_DEPOSIT")}</Button>
                    <Button className={classes.bankOptionsButton}>{t("APPS_BANK_WITHDRAW")}</Button>
                    <Button className={classes.bankOptionsButton}>{t("APPS_BANK_TRANSFER")}</Button>
                </div>
            </AppContent>
        </AppWrapper>
    )
}