import { TopNavigation } from '../../../components/Navigation/TopNavigation';
import { Link } from 'react-router-dom';
import { useConversations } from '../../../api/hooks/useConversations';

export const MessagesApp = () => {
  const conversations = useConversations();

  // TODO: Implement contacts here
  // const contacts = useContacts();

  return (
    <div>
      <TopNavigation title="Messages" />

      <ul className="flex flex-col gap-1 p-4">
        {conversations.map((conversation) => {
          return (
            <Link to={`/apps/conversation/${conversation}`}>
              <li key={conversation} className="p-6 bg-secondary rounded-lg">
                <p className="">Contact label</p>
                <p className="font-bold">{conversation}</p>
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};
