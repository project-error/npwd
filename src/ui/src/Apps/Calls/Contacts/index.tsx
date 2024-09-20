import { Link, Outlet, useSearchParams } from 'react-router-dom';
import { TopNavigation } from '../../../components/Navigation/TopNavigation';
import { useCurrentDevice } from '../../../api/hooks/useCurrentDevice';
import { useContacts } from '../../../api/hooks/useContacts';
import { Button } from '@/components/ui/button';

export const ContactsView = () => {
  const device = useCurrentDevice();
  const [contacts, , isLoading] = useContacts();

  const [searchParams] = useSearchParams();
  const referal = searchParams.get('referal');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex flex-col">
      <TopNavigation
        title="Contacts"
        right={
          <Link to="/apps/calls/contacts/new">
            <Button variant="ghost">New</Button>
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
                : `/apps/calls/contacts/${contact.id}`
            }
          >
            <li className="rounded-lg bg-secondary flex flex-col">
              <span className="text-xl font-bold ">{contact.name}</span>
              <span className="text-sm text-secondary">{contact.phone_number}</span>
            </li>
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
