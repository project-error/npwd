import React from 'react'
import { AppWrapper } from "../../../ui/components";
import { AppTitle } from "../../../ui/components/AppTitle";
import { AppContent } from "../../../ui/components/AppContent";
import { useTranslation } from "react-i18next";
import { useApps } from "../../appmarket/hooks/useApps";
import { PhoneList } from './PhoneList';
import { useCalls } from '../hooks/useCalls';

export const PhoneApp = () => {
    const { callList } = useCalls();
    const { getApp } = useApps();
    const { t } = useTranslation();
    return (
        <AppWrapper>
            <AppTitle color={getApp("phone").backgroundColor}>
                {t("APPS_PHONE")}
            </AppTitle>
            <AppContent>
                <PhoneList 
                    calls={callList}
                />
            </AppContent>
        </AppWrapper>
    )
}
