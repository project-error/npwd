import { CallEvents } from '../../../typings/call';
import { getSource } from '../utils/miscUtils';
import CallService, { callLogger } from './calls.service';

onNet(CallEvents.INITIALIZE_CALL, (receivingNumber: string) => {
  const src = getSource();
  CallService.handleInititializeCall(src, receivingNumber).catch((e) =>
    callLogger.error(
      `Error occured in intialize (${receivingNumber}) call event, Error: ${e.message}`,
    ),
  );
});

onNet(CallEvents.ACCEPT_CALL, (transmitterNumber: string) => {
  const src = getSource();
  CallService.handleAcceptCall(src, transmitterNumber).catch((e) =>
    callLogger.error(
      `Error occured in accept call event (${transmitterNumber}), Error:  ${e.message}`,
    ),
  );
});

onNet(CallEvents.REJECTED, (transmitterNumber: string) => {
  const src = getSource();
  CallService.handleRejectCall(src, transmitterNumber).catch((e) =>
    callLogger.error(
      `Error occured in rejectcall event (${transmitterNumber}), Error:  ${e.message}`,
    ),
  );
});

onNet(CallEvents.END_CALL, (transmitterNumber: string) => {
  const src = getSource();
  CallService.handleEndCall(src, transmitterNumber).catch((e) =>
    callLogger.error(
      `Error occured in end call event (${transmitterNumber}), Error:  ${e.message}`,
    ),
  );
});

onNet(CallEvents.FETCH_CALLS, (limit?: number) => {
  const src = getSource();
  CallService.handleFetchCalls(src, limit).catch((e) =>
    callLogger.error(`Error occured in fetch call event (${limit}), Error: ${e.message}`),
  );
});
