import React from 'react';
import Modal from '@ui/components/Modal';
import { findParticipants } from '../../utils/helpers';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import { Button } from '@npwd/keyos';
import { User, UserPlus } from 'lucide-react';

interface GroupDetailsModalProps {
  open: boolean;
  onClose: () => void;
  conversationList: string;
  addContact: (number: any) => void;
}

const GroupDetailsModal: React.FC<GroupDetailsModalProps> = ({
  open,
  onClose,
  conversationList,
  addContact,
}) => {
  const myPhoneNumber = useMyPhoneNumber();
  const { getContactByNumber } = useContactActions();

  const participants = findParticipants(conversationList, myPhoneNumber);

  const findContact = (phoneNumber: string) => {
    return getContactByNumber(phoneNumber);
  };

  const handleAddContact = (participant: string) => {
    addContact(participant);
  };

  return (
    <Modal visible={open} handleClose={onClose}>
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-keyos-cream">Details</h2>
        {participants.map((participant) => {
          const contact = findContact(participant);

          return (
            <div
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-keyos-panel px-3 py-2"
              key={participant}
            >
              <div className="flex items-center gap-2">
                <User size={18} />
                <p className="text-sm font-semibold text-keyos-cream">{contact?.display ?? participant}</p>
              </div>
              {!contact && (
                <Button onClick={() => handleAddContact(participant)} size="icon" variant="ghost">
                  <UserPlus size={18} />
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default GroupDetailsModal;
