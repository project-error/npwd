import React, { useState } from 'react';
import { Phone, PhoneOff, Volume2, VolumeX } from 'lucide-react';
import { useCall } from '../hooks/useCall';
import { useCallModal } from '../hooks/useCallModal';
import { StatusIconButton } from '@ui/components/StatusIconButton';
import { useNavigate } from 'react-router';
import { cn } from '@utils/css';

export const CallControls = ({ isSmall }: { isSmall?: boolean }) => {
  const navigate = useNavigate();
  const { setModal } = useCallModal();
  const { call, endCall, acceptCall, rejectCall, muteCall } = useCall();
  const [muted, setMuted] = useState(false);

  const iconClassName = 'text-white shadow-[0_.5rem_3rem_-0.25em_rgba(0,0,0,.3)]';
  const wrapperClassName = isSmall ? 'size-10' : 'size-[60px]';

  const handleAcceptCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/call');
    acceptCall();
  };

  const handleRejectCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModal(false);
    rejectCall();
  };

  const handleEndCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModal(false);
    endCall();
  };

  if (call?.is_accepted || call?.isTransmitter)
    return (
      <div
        className={cn(
          'my-2 flex px-2',
          call?.is_accepted ? 'justify-between' : 'justify-center',
        )}
      >
        <StatusIconButton
          color="error"
          size={isSmall ? 'small' : 'medium'}
          onClick={handleEndCall}
          className={wrapperClassName}
        >
          <PhoneOff className={iconClassName} />
        </StatusIconButton>
        {call?.is_accepted && (
          <StatusIconButton
            color={muted ? 'error' : 'success'}
            size={isSmall ? 'small' : 'medium'}
            onClick={() => {
              setMuted((state) => !state);
              muteCall(!muted);
            }}
            className={wrapperClassName}
          >
            {muted ? (
              <VolumeX className={iconClassName} />
            ) : (
              <Volume2 className={iconClassName} />
            )}
          </StatusIconButton>
        )}
      </div>
    );

  return (
    <div className="my-2 flex items-center justify-between px-2">
      <StatusIconButton
        color="error"
        size={isSmall ? 'small' : 'medium'}
        onClick={handleRejectCall}
        className={wrapperClassName}
      >
        <PhoneOff className={iconClassName} />
      </StatusIconButton>
      <StatusIconButton
        color="success"
        size={isSmall ? 'small' : 'medium'}
        onClick={handleAcceptCall}
        className={wrapperClassName}
      >
        <Phone className={iconClassName} />
      </StatusIconButton>
    </div>
  );
};
