import { Link, Outlet, useSearchParams } from 'react-router-dom';
import { TopNavigation } from '../../../components/Navigation/TopNavigation';
import { useCurrentDevice } from '../../../api/hooks/useCurrentDevice';
import { useContacts } from '../../../api/hooks/useContacts';

export const ContactsView = () => {
  const device = useCurrentDevice();
  const [contacts] = useContacts();

  const [searchParams] = useSearchParams();
  const referal = searchParams.get('referal');

  return (
    <main className="flex flex-col">
      <TopNavigation
        title="Contacts"
        right={
          <Link to="/apps/calls/contacts/new">
            <button>New</button>
          </Link>
        }
      />

      {device && (
        <div className="pt-2 px-4 flex flex-col">
          <span>Your phone number</span>
          <span className="font-semibold">{device.phone_number}</span>
        </div>
      )}

      <ul className="flex flex-col gap-2 p-4">
        {contacts.map((contact) => (
          <Link
            key={contact.id}
            className="bg-secondary p-4"
            to={
              referal
                ? `${referal}?data=${encodeURIComponent(JSON.stringify(contact))}`
                : `/apps/calls/call/${contact.phone_number}`
            }
          >
            <li className="text-xl font-bold rounded-lg bg-secondary">{contact.name}</li>
          </Link>
        ))}
      </ul>

      {contacts.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full">
          <span className="text-xl font-semibold">No contacts</span>
          <span className="text-lg text-gray-500">Create a new contact to get started</span>
        </div>
      )}

      <Outlet />
    </main>
  );
};
