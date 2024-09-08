/** Create 10 contacts with varying number of phone numbers, 1-3, where one is most common and 3 is least common.*/

import { Link } from 'react-router-dom';
import { TopNavigation } from '../../../components/Navigation/TopNavigation';

export const contacts = [
  {
    id: '1',
    name: 'Alice Doe',
    phoneNumbers: ['+1234567890'],
  },
  {
    id: '2',
    name: 'Bob Doe',
    phoneNumbers: ['+1234567891', '+1234567892'],
  },
  {
    id: '3',
    name: 'Charlie Doe',
    phoneNumbers: ['+1234567893', '+1234567894', '+1234567895'],
  },
  {
    id: '4',
    name: 'David Doe',
    phoneNumbers: ['+1234567896'],
  },
  {
    id: '5',
    name: 'Eve Doe',
    phoneNumbers: ['+1234567897', '+1234567898'],
  },
  {
    id: '6',
    name: 'Frank Doe',
    phoneNumbers: ['+1234567899'],
  },
  {
    id: '7',
    name: 'Grace Doe',
    phoneNumbers: ['+1234567800', '+1234567801', '+1234567802'],
  },
  {
    id: '8',
    name: 'Harry Doe',
    phoneNumbers: ['+1234567803'],
  },
  {
    id: '9',
    name: 'Isabel Doe',
    phoneNumbers: ['+1234567804', '+1234567805'],
  },
  {
    id: '10',
    name: 'Jack Doe',
    phoneNumbers: ['+1234567806'],
  },
];

export const ContactsView = () => {
  return (
    <main className="flex flex-col">
      <TopNavigation title="Contacts" />

      <ul className="flex flex-col gap-2 p-4">
        {contacts.map((contact) => (
          <Link
            key={contact.id}
            className="bg-secondary p-4"
            to={`/apps/calls/contacts/${contact.id}`}
          >
            <li className="text-xl font-bold rounded-lg bg-secondary">{contact.name}</li>
          </Link>
        ))}
      </ul>
    </main>
  );
};
