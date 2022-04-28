import {
  CallEvents,
  CallHistoryItem,
  TransmitterNumDTO,
  EndCallDTO,
  InitializeCallDTO,
  ActiveCall,
} from '../../../typings/call';
import { getSource, onNetTyped } from '../utils/miscUtils';
import CallService from './calls.service';
import { callLogger } from './calls.utils';
import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';
import { OnCallMap } from './middleware/onCall';
import PlayerService from '../players/player.service';
import MessagesService from '../messages/messages.service';

onNetPromise<InitializeCallDTO, ActiveCall>(CallEvents.INITIALIZE_CALL, async (reqObj, resp) => {
  const funcRef = OnCallMap.get(reqObj.data.receiverNumber);
  if (funcRef) {
    const caller = PlayerService.getPlayer(reqObj.source);
    const incomingCaller = {
      source: reqObj.source,
      name: caller.getName(),
      number: caller.getPhoneNumber(),
    };
    try {
      await new Promise<void>((resolve, reject) => {
        funcRef({
          incomingCaller,
          next: () => {
            resolve();
          },
          exit: () => {
            reject();
          },
          reply: (message) => {
            MessagesService.handleEmitMessage({
              senderNumber: reqObj.data.receiverNumber,
              targetNumber: incomingCaller.number,
              message,
            });
          },
          forward: (receiverNumber) => {
            CallService.handleInitializeCall({ ...reqObj, data: { receiverNumber } }, resp)
              .catch((e) => {
                resp({ status: 'error', errorMsg: 'SERVER_ERROR' });
                callLogger.error(`Error occured handling init call: ${e.message}`);
              })
              .then(() => {
                return;
              })
              .catch(reject);
          },
        });
      });
    } catch (e) {
      return resp({
        status: 'ok',
        data: {
          transmitter: incomingCaller.number,
          isTransmitter: true,
          receiver: reqObj.data.receiverNumber,
          isUnavailable: true,
          is_accepted: false,
          start: Math.floor(new Date().getTime() / 1000).toString(),
          identifier: caller.getIdentifier(),
        },
      });
    }
  }

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
