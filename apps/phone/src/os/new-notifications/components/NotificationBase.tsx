import {IApp} from '@os/apps/config/apps';
import {SnackbarContent, CustomContentProps} from 'notistack';
import React, {forwardRef} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router';
import {useNotification} from '../useNotification';
import {cn} from "@npwd/keyos";

interface NotificationBaseProps extends CustomContentProps {
    app: IApp;
    secondaryTitle?: string;
    path?: string;
    onClick?: () => void;
}

export type NotificationBaseComponent = React.FC<NotificationBaseProps>;

const NotificationBase = forwardRef<HTMLDivElement, NotificationBaseProps>((props, ref) => {
    const {markAsRead} = useNotification();
    const {app, message, secondaryTitle, path, onClick} = props;
    const [t] = useTranslation();
    const navigate = useNavigate();

    const handleNotisClick = () => {
        path && !onClick ? navigate(path) : onClick();
        markAsRead(props.id.toString());
    };

    if (!app) {
        console.error('App was not found. Could not render notification.');
        console.error(
            'If you are using an external app, make sure it is started before NPWD and that you pass the correct app id to the notification.',
        );
        return null;
    }

    if (!app.NotificationIcon) {
        console.warn('App does not have a notification icon');
    }

    return (
        <SnackbarContent
            onClick={handleNotisClick}
            ref={ref}
            style={{minWidth: '370px'}}
            className="keyos-shine-bg keyos-surface-panel flex rounded-md border border-[color:var(--keyos-border-muted)] bg-keyos-panel px-4 py-3.5"
        >
            <div className="mb-2 flex w-full items-center text-keyos-cream">
                <div
                    className={cn("p-2 flex items-center justify-center rounded-full")}
                    style={{backgroundColor: app.backgroundColor}}
                >
                    {app.NotificationIcon && <app.NotificationIcon fontSize="inherit"/>}
                </div>
                <div className="grow pl-1 text-sm font-semibold text-keyos-cream">
                    {t(app.nameLocale)}
                </div>
                <div>
                    <p className="text-sm text-keyos-muted">{secondaryTitle}</p>
                </div>
            </div>
            <div className="line-clamp-2 overflow-hidden text-base text-keyos-cream">
                <p>{message}</p>
            </div>
        </SnackbarContent>
    );
});

export default NotificationBase;