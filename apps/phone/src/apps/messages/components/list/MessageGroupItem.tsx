import React, { useCallback } from 'react';

import { MessageConversation } from '@typings/messages';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import { useContacts } from '../../../contacts/hooks/state';
import { Contact } from '@typings/contact';
import { ListItem } from '@npwd/keyos';
import { initials } from '@utils/misc';
import { Check, UsersRound } from 'lucide-react';

interface IProps {
  messageConversation: MessageConversation;
  handleClick: (conversations: MessageConversation) => () => void;
  isEditing: boolean;
  checked: number[];
  handleToggle: (id: number) => void;
}

const MessageGroupItem = ({
  messageConversation,
  handleClick,
  isEditing,
  checked,
  handleToggle,
}: IProps): any => {
  const toggleCheckbox = () => {
    handleToggle(messageConversation.id);
  };

  const contacts = useContacts();
  const { getContactByNumber } = useContactActions();

  const contactDisplay = useCallback(
    (number: string): Contact | null => {
      return contacts.length ? getContactByNumber(number) : null;
    },
    [contacts, getContactByNumber],
  );

  const getContact = useCallback((): Contact | null => {
    // This is the source
    const participant = messageConversation.participant;
    const conversationList = messageConversation.conversationList.split('+');

    for (const p of conversationList) {
      if (p !== participant) {
        const contact = contactDisplay(p);
        return contact || null;
      }
    }
  }, [contactDisplay, messageConversation]);

  const getLabelOrContact = useCallback((): Contact | string => {
    const conversationLabel = messageConversation.label;
    // This is the source
    const participant = messageConversation.participant;
    const conversationList = messageConversation.conversationList.split('+');

    // Label is required if the conversation is a group chat
    if (messageConversation.isGroupChat) return conversationLabel;

    return getContact()?.display || conversationList.filter((p) => p !== participant)[0];
  }, [messageConversation, getContact]);

  return (
    <ListItem key={messageConversation.id} button onClick={!isEditing ? handleClick(messageConversation) : toggleCheckbox}>
      <div className="flex w-full items-center gap-3">
        <div className="flex items-center">
          {isEditing && (
            <span className="mr-3 flex size-6 items-center justify-center rounded-full border border-white/15 bg-black/20">
              {checked.indexOf(messageConversation.id) !== -1 && (
                <Check className="size-4 text-[color:var(--keyos-app-accent)]" />
              )}
            </span>
          )}
          <div>
            {messageConversation.isGroupChat ? (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--keyos-app-surface)] text-[color:var(--keyos-app-accent)]">
                <UsersRound size={20} />
              </div>
            ) : getContact()?.avatar && getContact()?.avatar.length > 0 ? (
              <img
                src={getContact()?.avatar}
                className="inline-block h-11 w-11 rounded-full border border-white/10 object-cover"
                alt={'avatar'}
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--keyos-app-surface)]">
                <span className="font-semibold text-[color:var(--keyos-app-accent)]">
                  {initials(getContact()?.display)}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-keyos-cream">{getLabelOrContact()}</p>
          <p className="mt-0.5 text-xs text-keyos-muted">
            {messageConversation.isGroupChat ? 'Group conversation' : 'Tap to open conversation'}
          </p>
        </div>
        {messageConversation.unreadCount > 0 && (
          <span className="inline-flex min-w-7 items-center justify-center rounded-full bg-[color:var(--keyos-app-accent)] px-2 py-1 text-xs font-bold text-[color:var(--keyos-app-accent-foreground)] shadow-keyos-glow">
            {messageConversation.unreadCount <= 99 ? messageConversation.unreadCount : '99+'}
          </span>
        )}
      </div>
    </ListItem>
  );
};

export default MessageGroupItem;
