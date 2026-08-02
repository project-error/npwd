import { useApps } from '@os/apps/hooks/useApps';
import fetchNui from '@utils/fetchNui';
import { CustomContentProps, SnackbarContent, useSnackbar } from 'notistack';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@npwd/keyos';

interface SystemNotificationBaseProps extends CustomContentProps {
  secondaryTitle?: string;
  controls: boolean;
}

export type SystemNotificationBaseComponent = React.FC<SystemNotificationBaseProps>;

export const SystemNotificationBase = forwardRef<HTMLDivElement, SystemNotificationBaseProps>(
  (props, ref) => {
    const { secondaryTitle, message, controls } = props;
    const { closeSnackbar } = useSnackbar();
    const { getApp } = useApps();
    const app = getApp('SETTINGS');
    const [t] = useTranslation();

    const handleCloseNoti = () => {
      closeSnackbar(props.id);
    };

    const handleConfirmAction = async () => {
      await fetchNui('npwd:onNotificationConfirm', props.id);
    };

    const handleCancelAction = async () => {
      await fetchNui('npwd:onNotificationCancel', props.id);
    };

    return (
      <SnackbarContent
        className="keyos-surface-panel flex min-w-[370px] flex-col rounded-xl bg-keyos-panel p-4 shadow-[rgba(0,0,0,0.35)_0px_5px_15px]"
        onClick={handleCloseNoti}
        ref={ref}
      >
        <div className="mb-1.5 flex w-full items-center text-white">
          <div
            className="flex items-center justify-center rounded-full p-[5px]"
            style={{ backgroundColor: app.backgroundColor }}
          >
            <app.NotificationIcon className="size-[inherit]" />
          </div>
          <div className="grow pl-1 text-base font-normal text-[#bfbfbf]">{t('APPS_SYSTEM')}</div>
          <div>
            <p className="text-[#bfbfbf]">{secondaryTitle}</p>
          </div>
        </div>
        <div className="line-clamp-2 overflow-hidden text-base text-white">{message}</div>
        {controls && (
          <div>
            <Button onClick={handleConfirmAction} size="icon-sm" variant="ghost">
              <CheckCircle className="size-4" />
            </Button>
            <Button onClick={handleCancelAction} size="icon-sm" variant="ghost">
              <XCircle className="size-4" />
            </Button>
          </div>
        )}
      </SnackbarContent>
    );
  },
);
