import { CallEvents } from '../../typings/call';
import { getIdentifierByPhoneNumber, getPlayer, getSource } from './functions';
import { getPlayerFromIdentifier } from './functions';
import { CallHistoryItem } from '../../typings/call';

import { pool } from './db';
import { v4 as uuidv4 } from 'uuid';
import { mainLogger } from './sv_logger';

const callLogger = mainLogger.child({ module: 'calls' });

async function saveCall(call: CallHistoryItem) {
  const query =
    'INSERT INTO npwd_calls (identifier, transmitter, receiver, start) VALUES (?, ?, ?, ?)';
  await pool.query(query, [call.identifier, call.transmitter, call.receiver, call.start]);
}

async function updateCall(call: CallHistoryItem, isAccepted: boolean, end: number) {
  const query = 'UPDATE npwd_calls SET is_accepted=?, end=? WHERE identifier = ?';
  await pool.query(query, [isAccepted, end, call.identifier]);
}

async function fetchCalls(phoneNumber: string): Promise<CallHistoryItem[]> {
  const query = 'SELECT * FROM npwd_calls WHERE receiver = ? OR transmitter = ? ORDER BY id DESC';
  const [result] = await pool.query(query, [phoneNumber, phoneNumber]);
  const calls = <CallHistoryItem[]>result;
  return calls;
}

let calls: Map<string, CallHistoryItem> = new Map();

onNet(CallEvents.INITIALIZE_CALL, async (phoneNumber: string) => {
  const _source = getSource();

  const startCallTimeUnix = new Date().getTime() / 1000;

  const callIdentifier = uuidv4();

  // the client that is calling
  // TODO: Handle offline player calling
  const transmitterNumber = getPlayer(_source).getPhoneNumber();

  // player who is being called
  const receiverIdentifier = await getIdentifierByPhoneNumber(phoneNumber, true);
  const xReceiver = getPlayerFromIdentifier(receiverIdentifier);
  const receiverNumber = phoneNumber;

  if (!xReceiver.source) {
    callLogger.error('Player you are trying to call is not online', {
      source: _source,
    });
  }

  callLogger.debug('Receiver Number:', receiverIdentifier);

  callLogger.debug(`${_source} xReceiver.source`);

  calls.set(transmitterNumber, {
    identifier: callIdentifier,
    transmitter: transmitterNumber,
    transmitterSource: _source,
    receiver: receiverNumber,
    receiverSource: xReceiver.source,
    start: Math.floor(startCallTimeUnix),
    accepted: false,
  });

  callLogger.debug(`Call Set key: ${transmitterNumber}`);

  const currentCall = calls.get(transmitterNumber);
  await saveCall(currentCall);

  // events
  // client that is calling
  emitNet(CallEvents.START_CALL, _source, transmitterNumber, receiverNumber, true);

  // client that is being called
  emitNet(CallEvents.START_CALL, xReceiver.source, transmitterNumber, receiverNumber, false);
});

onNet(CallEvents.ACCEPT_CALL, async (transmitterNumber: string) => {
  const pSource = getSource();
  try {
    const currentCall = calls.get(transmitterNumber);

    // Sanity check if call exists in current set
    if (!currentCall) new Error('Transmitter number does not exist in set.');

    const channelId = pSource;

    await updateCall(currentCall, true, null);

    // player who is being called
    emitNet(CallEvents.WAS_ACCEPTED, pSource, channelId, currentCall, false);

    // player who is calling
    emitNet(CallEvents.WAS_ACCEPTED, currentCall.transmitterSource, channelId, currentCall, true);

    currentCall.accepted = true;
  } catch (e) {
    callLogger.error('Accepting Call Error', e.message, {
      source: pSource,
    });
  }
});

onNet(CallEvents.REJECTED, async (transmitterNumber: string, timestamp: number) => {
  const pSource = getSource();
  try {
    const currentCall = calls.get(transmitterNumber);

    // Sanity check if call exists in current set
    if (!currentCall) new Error('Transmitter number does not exist in set.');
    await updateCall(currentCall, false, timestamp);

    // player who is called and initiasted the rejection.
    emitNet(CallEvents.WAS_REJECTED, currentCall.receiverSource);

    // player who is calling and recieved the rejection.
    emitNet(CallEvents.WAS_REJECTED, currentCall.transmitterSource);
    calls.delete(transmitterNumber);
  } catch (e) {
    callLogger.error(`Phone Call Rejected Event Error ${e.message}`, {
      source: pSource,
    });
  }
});

onNet(CallEvents.END_CALL, async (transmitterNumber: string) => {
  const pSource = getSource();
  try {
    const currentTimeUnix = new Date().getTime() / 1000;

    const currentCall = calls.get(transmitterNumber);

    // Sanity check if call exists in current set
    if (!currentCall) new Error('Transmitter number does not exist in set.');

    await updateCall(currentCall, false, currentTimeUnix);

    // player who is being called
    emitNet(CallEvents.WAS_ENDED, currentCall.receiverSource);
    // player who is calling
    emitNet(CallEvents.WAS_ENDED, currentCall.transmitterSource);
    // ends animations if call is active
    if (currentCall.accepted) {
      emitNet(CallEvents.SEND_HANGUP_ANIM, currentCall.receiverSource);
      emitNet(CallEvents.SEND_HANGUP_ANIM, currentCall.transmitterSource);
    }
    calls.delete(transmitterNumber);
  } catch (e) {
    callLogger.error(`Error ending Phone Call, ${e.message}`, {
      source: pSource,
    });
  }
});

onNet(CallEvents.FETCH_CALLS, async () => {
  const _source = getSource();
  try {
    const phoneNumber = getPlayer(_source).getPhoneNumber();
    const calls = await fetchCalls(phoneNumber);
    emitNet(CallEvents.SEND_HISTORY, _source, calls);
  } catch (e) {
    callLogger.error(`Failed to fetch calls, ${e.message}`, {
      source: _source,
    });
  }
});
