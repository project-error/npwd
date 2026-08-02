import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import { useContactsValue } from '../../../contacts/hooks/state';
import { useMessageAPI } from '../../hooks/useMessageAPI';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { PreDBConversation } from '@typings/messages';
import { PreDBContact } from '@typings/contact';
import { Button, Input } from '@npwd/keyos';
import { ArrowLeft, X } from 'lucide-react';

const NewMessageGroupForm = ({ phoneNumber }: { phoneNumber?: string }) => {
  const navigate = useNavigate();
  const [t] = useTranslation();
  const [participants, setParticipants] = useState<PreDBContact[]>([]);
  const [conversationLabel, setConversationLabel] = useState<string>('');
  const [participantInput, setParticipantInput] = useState('');
  const { getContactByNumber } = useContactActions();
  const contacts = useContactsValue();
  const { addConversation } = useMessageAPI();

  const myPhoneNumber = useMyPhoneNumber();

  const isGroupChat = participants.length > 1;

  const handleSubmit = () => {
    const selectedParticipants = participants.map((participant) => participant.number);

    const dto: PreDBConversation = {
      conversationLabel: isGroupChat ? conversationLabel : '',
      participants: [myPhoneNumber, ...selectedParticipants],
      isGroupChat,
    };

    addConversation(dto);
  };

  useEffect(() => {
    if (phoneNumber) {
      const contact = getContactByNumber(phoneNumber) || {
        display: '',
        number: phoneNumber,
      };
      setParticipants((curVal) => [...curVal, contact]);
    }
  }, [phoneNumber, getContactByNumber]);

  const handleCancel = () => {
    navigate(-1);
  };

  const addParticipant = (participant: PreDBContact | string) => {
    const nextParticipant =
      typeof participant === 'string' ? { display: participant, number: participant } : participant;

    if (!nextParticipant.number) return;
    if (participants.some((p) => p.number === nextParticipant.number)) return;

    setParticipants((current) => [...current, nextParticipant]);
    setParticipantInput('');
  };

  const removeParticipant = (number: string) => {
    setParticipants((current) => current.filter((participant) => participant.number !== number));
  };

  const filteredContacts = (contacts || [])
    .filter((contact) => !participants.some((participant) => participant.number === contact.number))
    .filter((contact) => {
      const term = participantInput.toLowerCase();
      return contact.display?.toLowerCase().includes(term) || contact.number?.includes(term);
    })
    .slice(0, 6);

  const isYourself = participants.find((p) => p.number === myPhoneNumber);
  const disableSubmit =
    !participants?.length || (isGroupChat && !conversationLabel) || !!isYourself;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <button
          className="rounded-full p-2 text-keyos-muted transition hover:bg-white/10 hover:text-keyos-cream"
          onClick={handleCancel}
          type="button"
        >
          <ArrowLeft size={22} />
        </button>
        <h2 className="text-xl font-bold text-keyos-cream">{t('MESSAGES.NEW_MESSAGE')}</h2>
      </div>
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.16em] text-keyos-muted">
            {t('MESSAGES.INPUT_NAME_OR_NUMBER')}
          </label>
          <Input
            autoFocus
            onChange={(e) => setParticipantInput(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && participantInput.trim()) {
                e.preventDefault();
                addParticipant(participantInput.trim());
              }
            }}
            placeholder={t('MESSAGES.INPUT_NAME_OR_NUMBER')}
            value={participantInput}
          />
        </div>
        {!!participants.length && (
          <div className="flex flex-wrap gap-2">
            {participants.map((participant) => (
              <button
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--keyos-app-accent)] bg-[color:var(--keyos-app-accent)] px-3 py-1.5 text-xs font-semibold text-[color:var(--keyos-app-accent-foreground)]"
                key={participant.number}
                onClick={() => removeParticipant(participant.number)}
                type="button"
              >
                {participant.display || participant.number}
                <X size={14} />
              </button>
            ))}
          </div>
        )}
        {!!filteredContacts.length && (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-keyos-panel shadow-keyos-panel">
            {filteredContacts.map((contact) => (
              <button
                className="flex w-full items-center justify-between border-b border-white/10 px-4 py-3 text-left last:border-b-0 hover:bg-white/10"
                key={contact.number}
                onClick={() => addParticipant(contact)}
                type="button"
              >
                <span className="font-medium text-keyos-cream">{contact.display || contact.number}</span>
                <span className="text-xs text-keyos-muted">{contact.number}</span>
              </button>
            ))}
          </div>
        )}
      {isGroupChat && (
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.16em] text-keyos-muted">
            Conversation label
          </label>
          <Input
            placeholder="Conversation label"
            value={conversationLabel}
            onChange={(e) => setConversationLabel(e.currentTarget.value)}
          />
        </div>
      )}
      </div>
      <div className='space-y-2 border-t border-white/10 px-4 py-3'>
        <Button
          className='w-full bg-[color:var(--keyos-app-accent)] text-[color:var(--keyos-app-accent-foreground)] hover:brightness-110'
          onClick={handleSubmit}
          disabled={disableSubmit}
          type="submit"
        >
          {t('MESSAGES.NEW_MESSAGE_GROUP_SUBMIT')}
        </Button>
        <Button onClick={handleCancel} className='w-full' variant="danger">
          {t('GENERIC_CANCEL')}
        </Button>
      </div>
    </div>
  );
};

export default NewMessageGroupForm;
