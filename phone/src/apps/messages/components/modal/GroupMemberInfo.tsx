import React, { useMemo, useCallback } from 'react';
import Person from '@mui/icons-material/Person';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { ContextMenu, IContextMenuOption } from '@ui/components/ContextMenu';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import { MessageConversation } from '@typings/messages';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { useHistory, useLocation } from 'react-router-dom';
import { useCall } from '@os/call/hooks/useCall';
import PhoneIcon from '@mui/icons-material/Phone';
import ChatIcon from '@mui/icons-material/Chat';

interface GroupDetailsModalProps {
  open: boolean;
  onClose: () => void;
  participant: string;
  removeMember: (number: string) => void;
  conversation: MessageConversation;
  addContact: (number: string) => void;
  makeOwner: (number: string) => void;
}

const GroupMemberInfo: React.FC<GroupDetailsModalProps> = ({
  open,
  onClose,
  participant,
  removeMember,
  conversation,
  addContact,
  makeOwner,
}) => {
  const { getContactByNumber } = useContactActions();
  const { pathname } = useLocation();
  const history = useHistory();
  const { initializeCall } = useCall();

  const myPhoneNumber = useMyPhoneNumber();
  const isGroupOwner = conversation.owner === myPhoneNumber;
  const contact = getContactByNumber(participant);

  const messageContact = useCallback(
    (number: string) => {
      const referal = encodeURIComponent(pathname);
      return history.push(`/messages/new?phoneNumber=${number}&referal=${referal}`);
    },
    [history, pathname],
  );

  const menuOptions: IContextMenuOption[] = useMemo(
    () => [
      {
        label: 'Make Group Owner',
        icon: <SupervisorAccountIcon />,
        onClick: () => makeOwner(participant),
        hide: !isGroupOwner,
      },
      {
        label: contact ? 'Manage Contact' : 'Add Contact',
        icon: <Person />,
        onClick: () => addContact(participant),
      },
      {
        label: 'Message',
        icon: <ChatIcon />,
        onClick: () => messageContact(participant),
      },
      {
        label: 'Call',
        icon: <PhoneIcon />,
        onClick: () => initializeCall(participant),
      },
      {
        label: 'Remove from Group',
        icon: <PersonRemoveIcon />,
        onClick: () => removeMember(participant),
        hide: !isGroupOwner,
      },
    ],
    [isGroupOwner, contact, messageContact, participant, initializeCall, addContact, removeMember],
  );

  return <ContextMenu open={open} onClose={onClose} options={menuOptions} marginBottom={true} />;
};

export default GroupMemberInfo;
