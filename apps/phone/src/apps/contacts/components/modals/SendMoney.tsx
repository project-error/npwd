import React, { useState } from 'react';
import { Modal } from '@ui/components';
import { useTranslation } from 'react-i18next';
import { Button, Input } from '@npwd/keyos';
import { useContactsAPI } from '../../hooks/useContactsAPI';

interface SendMoneyModalProps {
  open: boolean;
  closeModal: () => void;
  openContact: string;
}

export const SendMoneyModal: React.FC<SendMoneyModalProps> = ({
  open,
  closeModal,
  openContact,
}) => {
  const { payContact } = useContactsAPI();
  const [t] = useTranslation();

  const [amount, setAmount] = useState(500);

  const handleAmountChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputVal = e.currentTarget.value;
    setAmount(parseInt(inputVal));
  };

  const sendContactMoney = () => {
    if (amount && amount > 0) {
      closeModal();
      payContact({ number: openContact, amount: amount });
    }
  };

  return (
    <Modal visible={open} handleClose={closeModal}>
      <div className="space-y-4 pt-2">
        <h2 className="text-xl font-bold text-keyos-cream">{t('CONTACTS.SENDMONEY')}</h2>
        <div className="flex flex-col items-start gap-3">
          <Input
            inputMode="numeric"
            onChange={handleAmountChange}
            placeholder={t('CONTACTS.AMOUNT')}
            value={amount}
          />
          <Button onClick={sendContactMoney} variant="accent">
            {t('GENERIC.SEND')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
