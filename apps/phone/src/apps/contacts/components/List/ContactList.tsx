import React from 'react';
import { SearchContacts } from './SearchContacts';
import { Link, useNavigate } from 'react-router';
import { useFilteredContacts } from '../../hooks/state';
import { Contact, ContactEvents } from "@typings/contact";
import { useCall } from '@os/call/hooks/useCall';
import useMessages from '@apps/messages/hooks/useMessages';
import LogDebugEvent from '@os/debug/LogDebugEvents';
import { useContactActions } from '@apps/contacts/hooks/useContactActions';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { Phone, MessageSquare, Plus, Clipboard, UsersRound } from 'lucide-react';
import { List, ListItem } from '@npwd/keyos';
import { initials } from '@utils/misc';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { Tooltip } from '@ui/components/Tooltip';
import { useTwitterProfileValue } from "@apps/twitter/hooks/state";
import { useTranslation } from "react-i18next";
import { setClipboard } from "@os/phone/hooks";
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import fetchNui from "@utils/fetchNui";

import { contactIconButtonClass } from '../ui/contact-buttons';
import { contactsSurfaces } from '../ui/contacts-surfaces';

export const ContactList: React.FC = () => {
  const filteredContacts = useFilteredContacts();
  const navigate = useNavigate();

  // FIXME: This should be reduced before being passed to the component
  const groupedContacts = filteredContacts.reduce((r, e) => {
    const group = e.display.charAt(0).toUpperCase();
    if (!r[group]) r[group] = { group, contacts: [e] };
    else r[group].contacts.push(e);

    return r;
  }, []);

  const myNumber = useMyPhoneNumber()
  const twitterProfile = useTwitterProfileValue()
  const avatar_url = twitterProfile?.avatar_url ?? ''

  return (
    <div className="relative flex h-full flex-col">
      <div className={contactsSurfaces.stickyHeader}>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="min-w-0 flex-1">
            <SearchContacts />
          </div>
          <button
            type="button"
            aria-label="Add contact"
            className={contactIconButtonClass.accent}
            onClick={() => navigate('/contacts/-1')}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-4">
        <nav className="space-y-2 overflow-y-auto" aria-label="Directory">
          <div key="self" className="relative">
            <List className={contactsSurfaces.list}>
                <SelfContact key="self" number={myNumber} avatar={avatar_url} />
            </List>
          </div>

          {Object.keys(groupedContacts)
            .sort()
            .map((letter) => (
              <div key={letter} className="relative">
                <div className={contactsSurfaces.sectionHeader}>
                  <h3>{letter}</h3>
                </div>
                <List className={contactsSurfaces.list}>
                  {groupedContacts[letter].contacts.map((contact: Contact) => (
                    <ContactItem key={contact.id} {...contact} />
                  ))}
                </List>
              </div>
            ))}
        </nav>
      </div>
    </div>
  );
};

interface ContactItemProps extends Contact {
  onClick?: () => void;
}

const SelfContact = ({number, avatar}: {number: string, avatar:string}) => {
  const [t] = useTranslation();
  const {addAlert} = useSnackbar()
  const copyNumber = () => {
    setClipboard(number);
    addAlert({
      message: t('GENERIC.WRITE_TO_CLIPBOARD_MESSAGE', {
        content: 'Number',
      }),
      type: 'success',
    });
  }

  const shareLocal = () => {
    fetchNui(ContactEvents.LOCAL_SHARE)
  }

  return (
    <ListItem>
      <div className="min-w-0 flex-1">
        <div
          className="flex items-center justify-between focus:outline-none"
        >
          <div className="flex items-center space-x-2">
            {avatar && avatar.length > 0 ? (
              <img src={avatar} className="inline-block h-10 w-10 rounded-full" alt={'avatar'} />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--keyos-app-surface)]">
                <span className="text-sm font-semibold text-[color:var(--keyos-app-accent)]">Me</span>
              </div>
            )}
            <div>
              <p className="text-base font-medium text-keyos-cream">
                {t('CONTACTS.MY_NUMBER')}
              </p>
              <p className="text-sm text-keyos-muted">{number}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Tooltip title={t('GENERIC.WRITE_TO_CLIPBOARD_TOOLTIP', {content: 'Number'}) as string}>
              <button
                onClick={copyNumber}
                className={contactIconButtonClass.muted}
              >
                <Clipboard size={16} />
              </button>
            </Tooltip>
            <Tooltip title={t('CONTACTS.NEARBY_SHARE')} >
              <button
                onClick={shareLocal}
                className={contactIconButtonClass.muted}
              >
                <UsersRound size={16} />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </ListItem>
  );
}

const ContactItem = ({ number, avatar, id, display }: ContactItemProps) => {
  const query = useQueryParams<{ referal: string }>();
  const { referal } = query;

  const { initializeCall } = useCall();
  const { goToConversation } = useMessages();
  const { findExistingConversation } = useContactActions();
  const myPhoneNumber = useMyPhoneNumber();
  const navigate = useNavigate();

  const startCall = (e) => {
    e.stopPropagation();
    e.preventDefault();
    LogDebugEvent({
      action: 'Emitting `Start Call` to Scripts',
      level: 2,
      data: true,
    });
    initializeCall(number.toString());
  };

  const handleMessage = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const phoneNumber = number.toString();
    LogDebugEvent({
      action: 'Routing to Message',
      level: 1,
      data: { phoneNumber },
    });
    const conversation = findExistingConversation(myPhoneNumber, phoneNumber);
    if (conversation) {
      return goToConversation(conversation);
    }

    navigate(`/messages/new?phoneNumber=${phoneNumber}`);
  };

  return (
    <ListItem>
      <div className="min-w-0 flex-1">
        <Link
          to={
            referal
              ? `${referal}?contact=${encodeURIComponent(JSON.stringify({ number, id, display }))}`
              : `/contacts/${id}`
          }
          className="flex items-center justify-between focus:outline-none"
        >
          <div className="flex items-center space-x-2">
            {avatar && avatar.length > 0 ? (
              <img src={avatar} className="inline-block h-10 w-10 rounded-full" alt={'avatar'} />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--keyos-app-surface)]">
                <span className="font-semibold text-[color:var(--keyos-app-accent)]">{initials(display)}</span>
              </div>
            )}
            <div>
              <p className="text-base font-medium text-keyos-cream">
                {display}
              </p>
              <p className="text-sm text-keyos-muted">{number}</p>
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              onClick={startCall}
              className={contactIconButtonClass.call}
            >
              <Phone size={16} />
            </button>
            <button
              onClick={handleMessage}
              className={contactIconButtonClass.accent}
            >
              <MessageSquare size={16} />
            </button>
          </div>
        </Link>
      </div>
    </ListItem>
  );
};
