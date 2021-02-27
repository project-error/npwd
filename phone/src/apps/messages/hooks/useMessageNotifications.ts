import { useCallback } from "react";
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { useApp } from '../../../os/apps/hooks/useApps';
import { useNotifications } from "../../../os/notifications/hooks/useNotifications";

export const useMessageNotifications = () => {
	const { t } = useTranslation() ;
	const history = useHistory();
	const { addNotificationAlert } = useNotifications();
	const { icon, notificationIcon } = useApp('MESSAGES');

	const setNotification = useCallback(({ number, message }) => {
		addNotificationAlert()
	}, [])
}
