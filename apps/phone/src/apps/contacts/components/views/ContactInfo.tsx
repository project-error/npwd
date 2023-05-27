import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useContactActions } from '../../hooks/useContactActions';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { NPWDButton, NPWDInput as Input } from '@ui/components';
import { ContactsDatabaseLimits } from '@typings/contact';
import { useContactsAPI } from '../../hooks/useContactsAPI';
import { ArrowLeft, HelpingHand, MessageCircle, Phone, Trash2 } from 'lucide-react';

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

  const { getContact } = useContactActions();
  const { updateContact, addNewContact, deleteContact } = useContactsAPI();

  const contact = getContact(parseInt(id));

  const [name, setName] = useState(contact?.display ?? '');
  const [number, setNumber] = useState(contact?.number ?? '');
  const [avatar, setAvatar] = useState(contact?.avatar ?? '');
  // Set state after checking if null

  const [t] = useTranslation();

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

  const handleContactDelete = () => {
    deleteContact({ id: contact.id });
  };

  const handleContactUpdate = () => {
    updateContact({ id: contact.id, number, avatar, display: name });
  };

  useEffect(() => {
    if (addNumber) setNumber(addNumber);
    if (avatarParam) setAvatar(avatarParam);
    if (nameParam) setName(nameParam);
  }, [addNumber, avatar, avatarParam, nameParam]);

  return (
    <div className="mx-auto h-full w-full">
      <button
        onClick={() => history.goBack()}
        className="mt-4 ml-4 rounded-md px-3 py-1 hover:dark:bg-neutral-800"
      >
        <ArrowLeft className="h-6 w-6 dark:text-neutral-300" />
      </button>
      <div className="mx-auto w-9/12">
        <div>
          <img src={avatar} className="mx-auto h-24 w-24 rounded-full text-center" />
        </div>
        <div className="mt-8">
          <Input
            placeholder={t('CONTACTS.FORM_NAME')}
            value={name}
            onChange={handleDisplayChange}
          />
        </div>

        {contact && (
          <div className="mt-4 grid w-full grid-cols-4 gap-x-4">
            <button className="group flex items-center justify-center rounded-md py-2 dark:bg-neutral-800 dark:hover:bg-neutral-700">
              <MessageCircle className="h-6 w-6 dark:text-neutral-400 dark:group-hover:text-neutral-100" />
            </button>
            <button className="group flex items-center justify-center rounded-md py-2 dark:bg-neutral-800 dark:hover:bg-neutral-700">
              <Phone className="h-6 w-6 dark:text-neutral-400 dark:group-hover:text-neutral-100" />
            </button>
            <button className="group flex items-center justify-center rounded-md py-2 dark:bg-neutral-800 dark:hover:bg-neutral-700">
              <HelpingHand className="h-6 w-6 dark:text-neutral-400 dark:group-hover:text-neutral-100" />
            </button>
            <button
              onClick={handleContactDelete}
              className="group flex items-center justify-center rounded-md py-2 dark:bg-red-100 dark:hover:bg-red-200"
            >
              <Trash2 className="h-6 w-6 dark:text-red-800" />
            </button>
          </div>
        )}

        <div className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-medium dark:text-neutral-400">
              {t('CONTACTS.FORM_NUMBER')}
            </label>
            <Input value={number} onChange={handleNumberChange} />
          </div>
          <div>
            <label className="text-sm font-medium dark:text-neutral-400">
              {t('CONTACTS.FORM_AVATAR')}
            </label>
            <Input value={avatar} onChange={handleAvatarChange} />
          </div>
        </div>

        <div className="mt-8">
          {contact ? (
            <NPWDButton onClick={handleContactUpdate}>{t('GENERIC.UPDATE')}</NPWDButton>
          ) : (
            <NPWDButton onClick={handleContactAdd}>{t('GENERIC.ADD')}</NPWDButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactsInfoPage;
