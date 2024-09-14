import { useParams } from 'react-router';
import { useCurrentDevice } from '../../../api/hooks/useCurrentDevice';
import { useActiveCall } from '../../../api/hooks/useActiveCall';
import { useEffectOnce } from '../../../hooks/useEffectOnce';
import { instance } from '../../../utils/fetch';
import { TopNavigation } from '../../../components/Navigation/TopNavigation';

export const Call = () => {
  const device = useCurrentDevice();
  const [call, invalidate, refetch] = useActiveCall();
  const params = useParams<{ phoneNumber: string }>();
  const { phoneNumber } = params;

  const handleCreateCall = async () => {
    await instance.post('/calls/call', { phoneNumber });
    invalidate();
  };

  const handleEndCall = async () => {
    await instance.post('/calls/active/end', {});
    invalidate();
  };

  const handleAcceptCall = async () => {
    await instance.post('/calls/active/accept', {});
    invalidate();
  };

  const handleDeclineCall = async () => {
    await instance.post('/calls/active/decline', {});
    invalidate();
  };

  useEffectOnce(() => {
    if (!phoneNumber || call) return;
    handleCreateCall();
  });

  if (!call) {
    return (
      <div className="p-4">
        <h1>Active Call</h1>
        <p>No active call found.</p>

        <button onClick={refetch} className="p-4 border rounded-lg">
          Refetch active call
        </button>
      </div>
    );
  }

  const isIncoming = call.receiver_id === device?.sim_card_id;
  const isAccepted = !!call.accepted_at;

  return (
    <div className="">
      <TopNavigation title={isIncoming ? 'Incoming' : 'Outgoing'} />
      <section className="p-4">
        <p>Caller: {call.caller_id}</p>
        <p>Receiver: {call.receiver_id}</p>
        <span>Is Anonymous: {call.is_anonymous}</span>

        <p>Created At: {call.created_at}</p>
        {call.accepted_at && <p>Accepted At: {call.accepted_at.toLocaleLowerCase()}</p>}

        <div className="py-4 gap-2 flex">
          {isIncoming && !isAccepted && (
            <>
              <button
                className="px-4 py-2 border rounded-lg bg-secondary"
                onClick={handleAcceptCall}
              >
                Accept call
              </button>
              <button
                className="px-4 py-2 border rounded-lg bg-secondary"
                onClick={handleDeclineCall}
              >
                Decline call
              </button>
            </>
          )}

          {(!isIncoming || isAccepted) && (
            <button className="px-4 py-2 border rounded-lg bg-secondary" onClick={handleEndCall}>
              End call
            </button>
          )}
        </div>

        <button onClick={refetch} className="p-4 border rounded-lg">
          Refetch active call
        </button>
      </section>
    </div>
  );
};
