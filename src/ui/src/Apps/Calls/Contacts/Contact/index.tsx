import { useParams } from 'react-router';
// import { contacts } from '..';
import { Link } from 'react-router-dom';
import { TopNavigation } from '../../../../components/Navigation/TopNavigation';

export const ContactView = () => {
  const { contactId } = useParams<{ contactId: string }>();

  if (!contactId) {
    return null;
  }
  const contact = {
    name: 'John Doe',
    phoneNumbers: ['123-456-7890'],
  };

  if (!contact) {
    return null;
  }

  return (
    <main className="flex flex-col">
      <TopNavigation
        title={contact.name}
        left={
          <Link to=".." relative="path">
            Back
          </Link>
        }
      />

      <section className="p-4 flex flex-col gap-2">
        <div className="bg-secondary p-4">
          <ul className="list-disc list-inside">
            {contact.phoneNumbers.map((phoneNumber) => (
              <Link key={phoneNumber} to={`/apps/calls/call/${phoneNumber}`}>
                <li>{phoneNumber}</li>
              </Link>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
};
