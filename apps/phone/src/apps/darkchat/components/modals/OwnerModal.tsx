import React, { useState } from 'react';
import { List } from '@ui/components/List';
import { ListItem } from '@npwd/keyos';
import { Modal, TextField, Tooltip } from '@ui/components';
import { useTranslation } from 'react-i18next';
import { Button } from '@ui/components/Button';
import { useDarkchatAPI } from '@apps/darkchat/hooks/useDarkchatAPI';
import { useNavigate } from 'react-router';
import { useActiveDarkchatValue, useDarkchatMembersValue } from '@apps/darkchat/state/state';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { ArrowLeftRight } from 'lucide-react';
import { NPWDButton } from '@npwd/keyos';
import { SegmentedControl } from '@npwd/keyos';

interface OwnerModalProps {
  open: boolean;
  closeModal: () => void;
}

export const OwnerModal: React.FC<OwnerModalProps> = ({ open, closeModal }) => {
  const [channelValue, setChannelValue] = useState<string>('');
  const [tabValue, setTabValue] = useState<string>('1');
  const channelMembers = useDarkchatMembersValue();
  const myPhoneNumber = useMyPhoneNumber();

  const filteredMembers =
    channelMembers && channelMembers.filter((member) => member.phoneNumber !== myPhoneNumber);

  const [t] = useTranslation();
  const { transferOwnership, deleteChannel } = useDarkchatAPI();
  const navigate = useNavigate();
  const activeDarkChat = useActiveDarkchatValue();

  const canDelete = activeDarkChat.identifier === channelValue;
  const isOwner = activeDarkChat.owner === myPhoneNumber;

  const handleDeleteChannel = () => {
    closeModal();
    deleteChannel(activeDarkChat.id);
    navigate('/darkchat');
  };

  const handleTransferOwnership = (memberIdentifier: string, phoneNumber: string) => {
    closeModal();
    transferOwnership(activeDarkChat.id, memberIdentifier, phoneNumber);
  };

  const tabOptions = [
    { label: t('DARKCHAT.MEMBERS'), value: '1' },
    ...(isOwner ? [{ label: t('DARKCHAT.DANGER_ZONE'), value: '2' }] : []),
  ];

  return (
    <Modal visible={open} handleClose={closeModal}>
      <div className="mb-4">
        <SegmentedControl options={tabOptions} value={tabValue} onChange={setTabValue} />
      </div>

      {tabValue === '1' && (
        <List>
          {filteredMembers &&
            filteredMembers.map((member) => (
              <ListItem
                key={member.phoneNumber}
                primaryText={member.phoneNumber}
                endElement={
                  <Tooltip title={t('DARKCHAT.TRANSFER_OWNERSHIP')}>
                    <NPWDButton
                      size="icon"
                      variant="ghost"
                      onClick={() => handleTransferOwnership(member.identifier, member.phoneNumber)}
                      aria-label="transfer ownership"
                    >
                      <ArrowLeftRight size={20} />
                    </NPWDButton>
                  </Tooltip>
                }
              />
            ))}
        </List>
      )}

      {tabValue === '2' && isOwner && (
        <div>
          <p className="text-keyos-cream">{t('DARKCHAT.DELETE_CHANNEL_TITLE')}</p>

          <div className="mb-2 mt-2">
            <p className="text-keyos-muted">
              {t('DARKCHAT.TYPE_TO_CONFIRM', {
                identifier: activeDarkChat.identifier,
              })}
            </p>

            <div className="flex flex-col items-start gap-2">
              <TextField
                placeholder={t('DARKCHAT.NEW_CHANNEL_INPUT_PLACEHOLDER')}
                value={channelValue}
                onChange={(e) => setChannelValue(e.currentTarget.value)}
              />
              <Button
                onClick={handleDeleteChannel}
                disabled={!canDelete}
                variant="outlined"
                color="secondary"
              >
                {t('GENERIC.DELETE')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
