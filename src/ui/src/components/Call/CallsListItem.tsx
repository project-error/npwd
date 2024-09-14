import { Call } from '../../../../shared/Types';
import { StringifyDates } from '../../../../shared/TypeUtils';

interface CallsListItemProps {
  call: StringifyDates<Call>;
}
export const CallsListItem = ({ call }: CallsListItemProps) => {
  const isOngoing = !call.ended_at;

  return (
    <li key={call.id} className="bg-secondary p-4 rounded-lg">
      {isOngoing && <h2 className="font-bold text-xl mb-4">Ongoing</h2>}
      <p>Caller: {call.caller_id}</p>
      <p>Receiver: {call.receiver_id}</p>
      <span>Is Anonymous: {call.is_anonymous}</span>

      <p>Created At: {call.created_at}</p>
      {call.accepted_at && <p>Accepted At: {call.accepted_at.toLocaleLowerCase()}</p>}
      {call.ended_at && <p>Ended At: {call.ended_at}</p>}
      {call.declined_at && <p>Declined At: {new Date(call.declined_at).toLocaleTimeString()}</p>}
      {call.missed_at && <p>Missed At: {new Date(call.missed_at).toLocaleTimeString()}</p>}
      {call.acknowledged_at && (
        <p>Acknowledged At: {new Date(call.acknowledged_at).toLocaleTimeString()}</p>
      )}
    </li>
  );
};
