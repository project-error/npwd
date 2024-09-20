import { Outlet, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { TopNavigation } from '../../../../components/Navigation/TopNavigation';
import { useContacts } from '@/api/hooks/useContacts';
import { Button } from '@/components/ui/button';

export const ContactView = () => {
  const { contactId } = useParams<{ contactId: string }>();
  const [contacts] = useContacts();
  const contact = contacts.find((contact) => contact.id === parseInt(contactId ?? '', 10));

  if (!contact) {
    return null;
  }

  return (
    <main className="flex flex-col">
      <TopNavigation
        title={contact.name}
        left={
          <Link to=".." relative="path">
            <Button variant="ghost">Back</Button>
          </Link>
        }
        right={
          <Link to={`edit`} relative="path">
            <Button variant="ghost">Edit</Button>
          </Link>
        }
      />

      <section className="p-4 flex flex-col gap-2">
        <div className="bg-secondary p-4">
          <Link to={`/apps/calls/call/${contact.phone_number}`}>
            <ul className="list-disc list-inside">{contact.phone_number}</ul>
          </Link>
        </div>
      </section>

      <Outlet />
    </main>
  );
};
