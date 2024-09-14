/** Create 10 contacts with varying number of phone numbers, 1-3, where one is most common and 3 is least common.*/

import { Link } from 'react-router-dom';
import { TopNavigation } from '../../../components/Navigation/TopNavigation';
import { useCurrentDevice } from '../../../api/hooks/useCurrentDevice';
import { getDevices } from '../../../api/device';
import { useQuery } from '@tanstack/react-query';

export const ContactsView = () => {
  const device = useCurrentDevice();
  const { data: { payload } = {} } = useQuery({
    queryKey: ['devices'],
    queryFn: getDevices,
  });

  const filteredPayload =
    payload?.filter((contact) => contact.phone_number !== device?.phone_number) ?? [];

  return (
    <main className="flex flex-col">
      <TopNavigation title="Contacts" />

      {device && (
        <div className="pt-2 px-4 flex flex-col">
          <span>Your phone number</span>
          <span className="font-semibold">{device.phone_number}</span>
        </div>
      )}

      <ul className="flex flex-col gap-2 p-4">
        {filteredPayload.map((contact) => (
          <Link
            key={contact.id}
            className="bg-secondary p-4"
            to={`/apps/calls/call/${contact.phone_number}`}
          >
            <li className="text-xl font-bold rounded-lg bg-secondary">{contact.phone_number}</li>
          </Link>
        ))}
      </ul>
    </main>
  );
};
