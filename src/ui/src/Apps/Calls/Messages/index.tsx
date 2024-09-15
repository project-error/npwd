import { TopNavigation } from '../../../components/Navigation/TopNavigation';
import { Link } from 'react-router-dom';
import { useConversations } from '../../../api/hooks/useConversations';
import { useContacts } from '@/api/hooks/useContacts';

export const MessagesApp = () => {
  const [contacts] = useContacts();
  const conversations = useConversations();

  return (
    <div>
      <TopNavigation title="Messages" />

      <ul className="flex flex-col gap-1 p-4">
        {conversations.map((phoneNumber) => {
          const contact = contacts.find((contact) => contact.phone_number === phoneNumber);

          return (
            <Link to={`/apps/conversation/${phoneNumber}`} key={phoneNumber}>
              <li className="p-6 bg-secondary rounded-lg">
                <p className="font-bold">{contact?.name || phoneNumber}</p>
                {contact?.name && <p className="text-sm text-gray-500">{phoneNumber}</p>}
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};
