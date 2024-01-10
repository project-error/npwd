import React, { HTMLAttributes, useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useContactActions } from '../../hooks/useContactActions';
import { useCall } from '@os/call/hooks/useCall';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import useMessages from '../../../messages/hooks/useMessages';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { NPWDInput } from '@ui/components';
import { NPWDButton } from '@npwd/keyos';
import { ContactsDatabaseLimits } from '@typings/contact';
import { useContactsAPI } from '../../hooks/useContactsAPI';
import { SendMoneyModal } from '../../components/modals/SendMoney';
import { ArrowLeft, HelpingHand, MessageCircle, Phone, Trash2 } from 'lucide-react';
import LogDebugEvent from '@os/debug/LogDebugEvents';
import { useModal } from '@apps/contacts/hooks/useModal';
import { usePhone } from '@os/phone/hooks/usePhone';
import { cn } from '@utils/css';
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

const useStyles = makeStyles({
  root: {
    height: '100%',
    width: '100%',
  },
  listContainer: {
    marginTop: 30,
    width: '75%',
    margin: '0 auto',
    textAlign: 'center',
  },
  avatar: {
    margin: 'auto',
    height: '125px',
    width: '124px',
    marginBottom: 29,
  },
  input: {
    marginBottom: 20,
    margin: 'auto',
    textAlign: 'center',
  },
  inputProps: {
    fontSize: 22,
  },
  button: {
    color: '#000000',
    backgroundColor: '#838383',
    '&:hover': {
      backgroundColor: '#6a6a6a',
    },
  },
});

const ContactsInfoPage: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
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

    history.push(`/messages/new?phoneNumber=${phoneNumber}`);
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
    <div className="mx-auto h-full w-full">
      <SendMoneyModal
        open={contactPayModal}
        closeModal={() => setContactPayModal(false)}
        openContact={number}
      />
      <button
        onClick={() => history.goBack()}
        className="ml-4 mt-4 rounded-md px-3 py-1 hover:dark:bg-neutral-800"
      >
        <ArrowLeft className="h-6 w-6 dark:text-neutral-300" />
      </button>
      <div className="mx-auto w-9/12">
        <div>
          {avatar && avatar.length > 0 ? (
            <img
              src={avatar}
              className="mx-auto h-24 w-24 rounded-full text-center"
              alt={'avatar'}
            />
          ) : (
            <div className="rounded-full-600 mx-auto h-24 w-24 text-center">
              <span className="text-5xl text-gray-600 dark:text-gray-300">
                {initials(contact.display)}
              </span>
            </div>
          )}
        </div>
        <div className="mt-8 space-y-2">
          <div className="text-sm font-medium text-neutral-400">{t('CONTACTS.FORM_NAME')}</div>
          <NPWDInput
            value={name}
            onChange={handleDisplayChange}
            className="focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {contact && (
          <div className="mt-4 flex w-full items-center justify-between">
            <ContactAction
              onClick={startCall}
              Icon={Phone}
              className="border-blue-500 bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-500 dark:text-white hover:dark:bg-blue-600"
            />
            <ContactAction onClick={handleMessage} Icon={MessageCircle} />

            {ResourceConfig?.general?.useResourceIntegration &&
              ResourceConfig?.contacts?.frameworkPay && (
                <button
                  onClick={openpayModal}
                  className="group flex items-center justify-center rounded-md py-2 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                >
                  <HelpingHand className="h-6 w-6 dark:text-neutral-400 dark:group-hover:text-neutral-100" />
                </button>
              )}
            <ContactAction onClick={handleContactDelete} Icon={Trash2} />
          </div>
        )}

        <div className="mt-8 space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-neutral-400">{t('CONTACTS.FORM_NUMBER')}</div>
            <NPWDInput
              value={number}
              onChange={handleNumberChange}
              className="focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-neutral-400">{t('CONTACTS.FORM_AVATAR')}</div>
            <NPWDInput
              value={avatar}
              onChange={handleAvatarChange}
              className="outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-8">
          {contact ? (
            <NPWDButton onClick={handleContactUpdate} className="w-full">
              {t('GENERIC.UPDATE')}
            </NPWDButton>
          ) : (
            <NPWDButton onClick={handleContactAdd} className="w-full">
              {t('GENERIC.ADD')}
            </NPWDButton>
          )}
        </div>
      </div>
    </div>
  );
};

interface ContactActionProps extends HTMLAttributes<HTMLButtonElement> {
  onClick: () => void;
  Icon: React.Component;
}
export const ContactAction: React.FC<ContactActionProps> = ({ Icon, onClick, ...props }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group flex items-center justify-center rounded-full bg-neutral-200 p-2.5 text-neutral-900 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700',
        props.className,
      )}
    >
      <Icon className="h-6 w-6" />
    </button>
  );
};

export default ContactsInfoPage;
