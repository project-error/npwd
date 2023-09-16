import { useApp } from '@os/apps/hooks/useApps';
import { AppTitle } from '@ui/components';
import { Plus } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ContactList } from '../List/ContactList';

export const ContactPage: React.FC = () => {
  const contacts = useApp('CONTACTS');

  const navigate = useNavigate();
  return (
    <>
      <AppTitle app={contacts} />
      <button
        onClick={() => navigate('/contacts/-1')}
        className="absolute right-5 top-5 rounded-md bg-blue-100 p-2 hover:bg-blue-200"
      >
        <Plus className="h-5 w-5 text-blue-800" />
      </button>
      <div className="mt-6">
        <ContactList />
      </div>
    </>
  );
};
