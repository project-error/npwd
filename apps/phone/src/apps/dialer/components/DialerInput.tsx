import React, { useContext } from 'react';
import { Phone, UserRoundPlus } from 'lucide-react';
import { DialInputCtx, IDialInputCtx } from '../context/InputContext';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { InputBase } from '@ui/components/Input';
import { useCall } from '@os/call/hooks/useCall';
import { toggleKeys } from '@ui/components/Input';
import { cn } from '@utils/css';

export const DialerInput: React.FC = () => {
  const navigate = useNavigate();
  const [t] = useTranslation();
  const { initializeCall } = useCall();

  const { inputVal, set } = useContext<IDialInputCtx>(DialInputCtx);

  const handleCall = (number: string) => {
    initializeCall(number);
  };

  const handleNewContact = (number: string) => {
    navigate(`/contacts/-1/?addNumber=${number}&referal=/phone/contacts`);
  };

  return (
    <div className="flex h-[100px] items-center bg-keyos-night px-5 py-6 text-right">
      <InputBase
        placeholder={t('DIALER.INPUT_PLACEHOLDER')}
        className="flex-1 text-xl"
        value={inputVal}
        onChange={(e) => set(e.target.value)}
      />
      <button
        type="button"
        aria-label={t('GENERIC.CALL')}
        className={cn(
          'rounded-full p-2.5 text-[color:var(--keyos-app-accent)] transition-colors hover:bg-white/10',
          inputVal <= '' && 'pointer-events-none opacity-40',
        )}
        disabled={inputVal <= ''}
        onClick={() => handleCall(inputVal)}
      >
        <Phone size={28} />
      </button>
      <button
        type="button"
        aria-label="Add contact"
        className="rounded-full p-2.5 text-keyos-fg transition-colors hover:bg-white/10"
        onClick={() => handleNewContact(inputVal)}
        onMouseUp={() => {
          toggleKeys(false);
        }}
      >
        <UserRoundPlus size={28} />
      </button>
    </div>
  );
};
