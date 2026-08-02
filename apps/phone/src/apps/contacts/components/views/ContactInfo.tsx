import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { useContactActions } from '../../hooks/useContactActions';
import { useCall } from '@os/call/hooks/useCall';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import useMessages from '../../../messages/hooks/useMessages';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { Button, Input } from '@npwd/keyos';
import { ContactAction } from '../ui/contact-buttons';
import { contactsSurfaces } from '../ui/contacts-surfaces';
import { ContactsDatabaseLimits } from '@typings/contact';
import { useContactsAPI } from '../../hooks/useContactsAPI';
import { SendMoneyModal } from '../../components/modals/SendMoney';
import { ArrowLeft, HelpingHand, MessageCircle, Phone, Trash2 } from 'lucide-react';
import LogDebugEvent from '@os/debug/LogDebugEvents';
import { useModal } from '@apps/contacts/hooks/useModal';
import { usePhone } from '@os/phone/hooks/usePhone';
import { initials } from '@utils/misc';

interface ContactInfoRouteParams {
  mode: string;
  id: string;
}

interface ContactInfoRouteQuery {
  addNumber?: string;
  referal?: string;
  name?: string;
  avatar?: string;
}

const ContactsInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<ContactInfoRouteParams>();
  const {
    addNumber,
    // Because this is mispelled absolutely everywhere
    referal: referral,
    avatar: avatarParam,
    name: nameParam,
  } = useQueryParams<ContactInfoRouteQuery>({
    referal: '/contacts',
  });

  const { contactPayModal, setContactPayModal } = useModal();
  const { getContact, findExistingConversation } = useContactActions();
  const { updateContact, addNewContact, deleteContact } = useContactsAPI();
  const { initializeCall } = useCall();
  const myPhoneNumber = useMyPhoneNumber();
  const { goToConversation } = useMessages();

  const contact = getContact(parseInt(id));

  const [name, setName] = useState(contact?.display ?? '');
  const [number, setNumber] = useState(contact?.number ?? '');
  const [avatar, setAvatar] = useState(
    contact?.avatar ?? 'https://i.fivemanage.com/images/3ClWwmpwkFhL.png',
  );
  // Set state after checking if null

  const [t] = useTranslation();
  const { ResourceConfig } = usePhone();

  const handleNumberChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputVal = e.currentTarget.value;
    if (inputVal.length === ContactsDatabaseLimits.number) return;
    setNumber(e.target.value);
  };

  const handleDisplayChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputVal = e.currentTarget.value;
    if (inputVal.length === ContactsDatabaseLimits.display) return;
    setName(e.target.value);
  };

  const handleAvatarChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputVal = e.currentTarget.value;
    if (inputVal.length === ContactsDatabaseLimits.avatar) return;
    setAvatar(e.target.value);
  };

  const handleContactAdd = () => {
    addNewContact({ display: name, number, avatar }, referral);
  };

  const startCall = () => {
    LogDebugEvent({
      action: 'Emitting `Start Call` to Scripts',
      level: 2,
      data: true,
    });
    initializeCall(number.toString());
  };

  const handleMessage = () => {
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

  const handleContactDelete = () => {
    deleteContact({ id: contact.id });
  };

  const handleContactUpdate = () => {
    updateContact({ id: contact.id, number, avatar, display: name });
  };

  const openpayModal = () => {
    if (ResourceConfig?.general?.useResourceIntegration && ResourceConfig?.contacts?.frameworkPay) {
      setContactPayModal(true);
    }
  };

  useEffect(() => {
    if (addNumber) setNumber(addNumber);
    if (avatarParam) setAvatar(avatarParam);
    if (nameParam) setName(nameParam);
  }, [addNumber, avatarParam, nameParam]);

  if (!ResourceConfig) return null;

  return (
    <div className="mx-auto h-full w-full overflow-y-auto">
      <SendMoneyModal
        open={contactPayModal}
        closeModal={() => setContactPayModal(false)}
        openContact={number}
      />
      <button
        onClick={() => navigate(-1)}
        className="ml-4 mt-4 rounded-xl px-3 py-2 text-keyos-muted transition hover:bg-white/10 hover:text-keyos-cream"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>
      <div className="mx-auto w-9/12">
        <div>
          {avatar && avatar.length > 0 ? (
            <img
              src={avatar}
              className={`${contactsSurfaces.avatarRing} mx-auto h-24 w-24 rounded-full object-cover text-center`}
              alt={'avatar'}
            />
          ) : (
            <div className={`${contactsSurfaces.avatarPlaceholder} mx-auto flex h-24 w-24 items-center justify-center rounded-full text-center`}>
              <span className="text-5xl font-semibold text-[color:var(--keyos-app-accent)]">
                {initials(name)}
              </span>
            </div>
          )}
        </div>
        <div className="mt-8 space-y-2">
          <div className="text-sm font-medium text-keyos-muted">{t('CONTACTS.FORM_NAME')}</div>
          <Input
            value={name}
            onChange={handleDisplayChange}
            className={contactsSurfaces.input}
          />
        </div>

        {contact && (
          <div className="mt-4 flex w-full items-center justify-between">
            <ContactAction onClick={startCall} Icon={Phone} variant="accent" />
            <ContactAction onClick={handleMessage} Icon={MessageCircle} variant="accent" />

            {ResourceConfig?.general?.useResourceIntegration &&
              ResourceConfig?.contacts?.frameworkPay && (
                <Button onClick={openpayModal} size="icon-sm" variant="secondary">
                  <HelpingHand className="h-4 w-4" />
                </Button>
              )}
            <ContactAction onClick={handleContactDelete} Icon={Trash2} variant="danger" />
          </div>
        )}

        <div className="mt-8 space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-keyos-muted">{t('CONTACTS.FORM_NUMBER')}</div>
            <Input
              value={number}
              onChange={handleNumberChange}
              className={contactsSurfaces.input}
            />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-keyos-muted">{t('CONTACTS.FORM_AVATAR')}</div>
            <Input
              value={avatar}
              onChange={handleAvatarChange}
              className={contactsSurfaces.input}
            />
          </div>
        </div>

        <div className="mt-8">
          {contact ? (
            <Button className="w-full" onClick={handleContactUpdate} variant="accent">
              {t('GENERIC.UPDATE')}
            </Button>
          ) : (
            <Button className="w-full" onClick={handleContactAdd} variant="accent">
              {t('GENERIC.ADD')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactsInfoPage;
