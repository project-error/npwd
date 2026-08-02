import React from 'react';
import { Avatar } from '@npwd/keyos';
import { useContactActions } from '../../../apps/contacts/hooks/useContactActions';
import { useCall } from '../hooks/useCall';
import { useTranslation } from 'react-i18next';

const CallContactContainer = () => {
  const [t] = useTranslation();
  const { call } = useCall();

  const { getDisplayByNumber, getPictureByNumber } = useContactActions();

  const getDisplayOrNumber = () =>
    call.isTransmitter
      ? getDisplayByNumber(call?.receiver)
      : !call.isTransmitter && call.isAnonymous
        ? 'Anonymous'
        : getDisplayByNumber(call?.transmitter);

  return (
    <div className="flex items-center">
      <div className="min-w-0 grow overflow-hidden text-ellipsis">
        <p className="text-[length:var(--keyos-text-body)] text-keyos-fg">
          {call.isTransmitter
            ? t('CALLS.MESSAGES.OUTGOING').toUpperCase()
            : t('CALLS.MESSAGES.INCOMING').toUpperCase()}
        </p>
        <p className="truncate text-[length:var(--keyos-text-title)] font-semibold text-keyos-fg">
          {getDisplayOrNumber()}
        </p>
      </div>
      <Avatar
        alt={getDisplayOrNumber()}
        className="ml-1 size-20"
        size="xl"
        src={
          call.isTransmitter
            ? getPictureByNumber(call.receiver)
            : !call.isTransmitter && call.isAnonymous
              ? 'https://i.fivemanage.com/images/3ClWwmpwkFhL.png'
              : getPictureByNumber(call?.transmitter)
        }
      />
    </div>
  );
};

export default CallContactContainer;
