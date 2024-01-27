import CallEnd from '@mui/icons-material/CallEnd';
import {Avatar} from '@mui/material';
import {SnackbarContent, CustomContentProps} from 'notistack';
import React, {forwardRef, useMemo} from 'react';
import {useCurrentCallValue} from '@os/call/hooks/state';
import {useCall} from '@os/call/hooks/useCall';
import useTimer from '@os/call/hooks/useTimer';
import {useTranslation} from 'react-i18next';
import {useContactActions} from '@apps/contacts/hooks/useContactActions';
import {NPWDButton} from "@npwd/keyos";
import {Phone} from "lucide-react";

interface CallNotificationBaseProps extends CustomContentProps {
    title: string;
    transmitter: string;
    receiver: string;
}

export type CallNotificationBaseComponent = React.FC<CallNotificationBaseProps>;

const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

export const CallNotificationBase = forwardRef<HTMLDivElement, CallNotificationBaseProps>(
    (props, ref) => {
        const {endCall, acceptCall, rejectCall} = useCall();
        const {transmitter, receiver} = props;
        const call = useCurrentCallValue();
        const {minutes, seconds, startTimer, resetTimer} = useTimer();

        const {getPictureByNumber} = useContactActions();

        const {t} = useTranslation();

        const RECEIVER_TEXT = useMemo(
            () =>
                call?.is_accepted
                    ? receiver
                    : `${t('DIALER.MESSAGES.CALLING', {
                        transmitter: receiver,
                    })}`,
            [call.is_accepted, receiver],
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
                style={{minWidth: '370px'}}
                className="bg-neutral-50 dark:bg-neutral-900 py-3.5 px-4 w-auto flex items-center justify-between rounded-md shadow-md border-2 border-neutral-200 dark:border-neutral-800"
            >
                <div className="flex items-center text-neutral-900 dark:text-neutral-50 space-x-2">
                    <div className="flex justify-center items-center">
                        <Avatar src={getDisplayAvatar()} alt="Transmitter"/>
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
                            <Phone size={18}/>
                        </NPWDButton>
                    )}
                    <NPWDButton
                        onClick={handleEndOrRejectCall}
                        size="icon"
                        className="rounded-full bg-red-600 hover:bg-red-700"
                    >
                        <CallEnd sx={{fontSize: 18}}/>
                    </NPWDButton>
                </div>
            </SnackbarContent>
        );
    },
);
