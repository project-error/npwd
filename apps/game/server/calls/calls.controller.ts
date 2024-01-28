import {
  CallEvents,
  CallHistoryItem,
  TransmitterNumDTO,
  EndCallDTO,
  InitializeCallDTO,
  ActiveCall,
} from '@typings/call';
import { getSource, onNetTyped } from '../utils/miscUtils';
import CallService from './calls.service';
import { callLogger } from './calls.utils';
import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';
import OncallService from "./middleware/oncall.service";
import './middleware'

onNetPromise<InitializeCallDTO, ActiveCall>(CallEvents.INITIALIZE_CALL, async (reqObj, resp) => {
  await OncallService.handle(reqObj, resp)

  CallService.handleInitializeCall(reqObj, resp).catch((e) => {
    resp({ status: 'error', errorMsg: 'SERVER_ERROR' });
    callLogger.error(`Error occured handling init call: ${e.message}`);
  });
});

onNetTyped<TransmitterNumDTO>(CallEvents.ACCEPT_CALL, ({ transmitterNumber }) => {
  const src = getSource();
  CallService.handleAcceptCall(src, transmitterNumber).catch((e) =>
    callLogger.error(
      `Error occured in accept call event (${transmitterNumber}), Error:  ${e.message}`,
    ),
  );
});

// Fire and forget event, client doesn't care what response is we reject no matter what.
// thats the reason its not promise
onNetTyped<TransmitterNumDTO>(CallEvents.REJECTED, (data) => {
  const src = getSource();
  CallService.handleRejectCall(src, data.transmitterNumber).catch((e) =>
    callLogger.error(
      `Error occured in rejectcall event (${data.transmitterNumber}), Error:  ${e.message}`,
    ),
  );
});

onNetPromise<EndCallDTO, void>(CallEvents.END_CALL, (reqObj, resp) => {
  CallService.handleEndCall(reqObj, resp).catch((e) => {
    callLogger.error(
      `Error occured in end call event (${reqObj.data.transmitterNumber}), Error:  ${e.message}`,
    );
    resp({ status: 'error', errorMsg: 'SERVER_ERROR' });
  });
});

onNetPromise<void, CallHistoryItem[]>(CallEvents.FETCH_CALLS, (reqObj, resp) => {
  CallService.handleFetchCalls(reqObj, resp).catch((e) => {
    resp({ status: 'error', errorMsg: 'SERVER_ERROR' });
    callLogger.error(`Error occured in fetch call event, Error: ${e.message}`);
  });
});
