import { Avatar, NPWDButton } from '@npwd/keyos';
import { SnackbarContent, CustomContentProps } from 'notistack';
import React, { forwardRef, useMemo } from 'react';
import { useCurrentCallValue } from '@os/call/hooks/state';
import { useCall } from '@os/call/hooks/useCall';
import useTimer from '@os/call/hooks/useTimer';
import { useTranslation } from 'react-i18next';
import { useContactActions } from '@apps/contacts/hooks/useContactActions';
import { Phone, PhoneOff } from 'lucide-react';

interface CallNotificationBaseProps extends CustomContentProps {
  title: string;
  transmitter: string;
  receiver: string;
}

export type CallNotificationBaseComponent = React.FC<CallNotificationBaseProps>;

const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

export const CallNotificationBase = forwardRef<HTMLDivElement, CallNotificationBaseProps>(
  (props, ref) => {
    const { endCall, acceptCall, rejectCall } = useCall();
    const { transmitter, receiver } = props;
    const call = useCurrentCallValue();
    const { minutes, seconds, startTimer, resetTimer } = useTimer();

    const { getPictureByNumber } = useContactActions();

    const { t } = useTranslation();

    const RECEIVER_TEXT = useMemo(
      () =>
        call?.is_accepted
          ? receiver
          : `${t('DIALER.MESSAGES.CALLING', {
              transmitter: receiver,
            })}`,
      [call.is_accepted, receiver, t],
    );

    const handleAcceptCall = () => {
      acceptCall();

      resetTimer();
      startTimer();
    };

    const handleEndOrRejectCall = () => {
      if (!call.is_accepted && !call.isTransmitter) {
        rejectCall();
      } else {
        endCall();
      }
      resetTimer();
    };

    if (!call) {
      return null;
    }

    const getDisplayAvatar = () => {
      return call.isTransmitter
        ? getPictureByNumber(call.receiver)
        : getPictureByNumber(call?.transmitter);
    };

    return (
      <SnackbarContent
        ref={ref}
        style={{ minWidth: '370px' }}
        className="flex w-auto items-center justify-between rounded-md border-2 border-neutral-200 bg-neutral-50 px-4 py-3.5 shadow-md dark:border-neutral-800 dark:bg-neutral-900"
      >
        <div className="flex items-center space-x-2 text-neutral-900 dark:text-neutral-50">
          <div className="flex items-center justify-center">
            <Avatar alt="Transmitter" src={getDisplayAvatar()} />
          </div>
          <div>
            {call?.isTransmitter ? (
              <p className="text-sm text-neutral-900 dark:text-neutral-50">{RECEIVER_TEXT}</p>
            ) : (
              <p className="text-sm text-neutral-900 dark:text-neutral-50">{transmitter}</p>
            )}
          </div>
        </div>
        <div className="flex space-x-4">
          {call?.is_accepted && (
            <p className="text-sm text-neutral-900 dark:text-neutral-50">
              {`${formatTime(minutes)}:${formatTime(seconds)}`}
            </p>
          )}
          {!call?.isTransmitter && !call?.is_accepted && (
            <NPWDButton
              onClick={handleAcceptCall}
              size="icon"
              className="rounded-full bg-green-600 hover:bg-green-700"
            >
              <Phone size={18} />
            </NPWDButton>
          )}
          <NPWDButton
            onClick={handleEndOrRejectCall}
            size="icon"
            className="rounded-full bg-red-600 hover:bg-red-700"
          >
            <PhoneOff size={18} />
          </NPWDButton>
        </div>
      </SnackbarContent>
    );
  },
);
