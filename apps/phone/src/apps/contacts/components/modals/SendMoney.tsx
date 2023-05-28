import React, { useState } from 'react';
import { Modal, TextField } from '@ui/components';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { Button } from '@ui/components/Button';
import { TabContext, TabPanel } from '@mui/lab';
import { useTranslation } from 'react-i18next';
import { useContactsAPI } from '../../hooks/useContactsAPI';

interface SendMoneyModalProps {
  open: boolean;
  closeModal: () => void;
  openContact: string;
}

export const SendMoneyModal: React.FC<SendMoneyModalProps> = ({ open, closeModal, openContact }) => {
    const { payContact } = useContactsAPI();
    const [t] = useTranslation();

    const [amount, setAmount] = useState(500);

    const handleAmountChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const inputVal = e.currentTarget.value;
        setAmount(parseInt(inputVal));
    };

    const sendContactMoney = () => {
        if (amount && amount > 0)
        {
            closeModal();
            payContact({ number: openContact, amount: amount });
        }
    };

    return (
        <Modal visible={open} handleClose={closeModal}>
        <TabContext value='1'>
            <TabPanel value="1">
                <Typography>{t('CONTACTS.SENDMONEY')}</Typography>

                <Box mt={2} mb={2}>
                <Box display="flex" flexDirection="column" alignItems="flex-start" gap={2}>
                    <TextField placeholder={t('CONTACTS.AMOUNT')} value={amount} onChange={handleAmountChange} />
                    <Button onClick={sendContactMoney} variant="outlined" color="primary" >
                    {t('GENERIC.SEND')}
                    </Button>
                </Box>
                </Box>
            </TabPanel>
        </TabContext>
        </Modal>
    );
};
