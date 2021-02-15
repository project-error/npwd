import events from '../utils/events';
import { ESX } from './server';
import { getSource } from './functions';
import { pool } from './db';
import {
  Transfer,
  IBankCredentials,
} from '../../phone/src/common/typings/bank';
import { getIdentifier } from './functions';
import { mainLogger } from './sv_logger';

const bankLogger = mainLogger.child({ module: 'bank' });

async function fetchAllTransactions(identifier: string): Promise<Transfer[]> {
  const query =
    'SELECT * FROM npwd_bank_transfers WHERE identifier = ? ORDER BY id DESC';
  const [results] = await pool.query(query, [identifier]);
  const transactions = <Transfer[]>results;

  bankLogger.verbose(
    `Fetched all transactions (${identifier}) - ${JSON.stringify(transactions)}`
  );

  return transactions;
}

function fetchCredentials(): IBankCredentials {
  const name = ESX.GetPlayerFromId(getSource()).getName();
  const balance = ESX.GetPlayerFromId(getSource()).getAccount('bank').money;

  const result = {
    name,
    balance,
  };

  bankLogger.verbose(`Fetching banking credentials - ${name} - ${balance}`);

  return result;
}

async function addTransfer(
  identifier: string,
  transfer: Transfer
): Promise<any> {
  const xPlayer = ESX.GetPlayerFromId(getSource());
  const bankBalance = xPlayer.getAccount('bank').money;
  const sourceName = xPlayer.getName();

  const xTarget = ESX.GetPlayerFromId(transfer.targetID);

  if (transfer.transferAmount > bankBalance) {
    emitNet(events.BANK_TRANSACTION_ALERT, getSource(), false);
  } else if (transfer.transferAmount < bankBalance) {
    emitNet(events.BANK_TRANSACTION_ALERT, getSource(), true);

    xTarget.addAccountMoney('bank', transfer.transferAmount);
    xPlayer.removeAccountMoney('bank', transfer.transferAmount);

    const query =
      'INSERT INTO npwd_bank_transfers (identifier, target, amount, message, type, source) VALUES (?, ?, ?, ?, ?, ?)';

    const [results] = await pool.query(query, [
      identifier,
      transfer.targetID,
      transfer.transferAmount,
      transfer.message,
      'Transfer',
      sourceName,
    ]);
    const insertData = <any>results;
    return await getTransfer(insertData.insertId);
  }
}

/**
 * Gets a transfer from its ID
 * @param transferId - transfer id
 */
async function getTransfer(transferId: number): Promise<Transfer> {
  const query = 'SELECT * FROM npwd_bank_transfers WHERE id = ?';
  const [results] = await pool.query(query, [transferId]);
  const transfers = <Transfer[]>results;
  const transfer = transfers[0];
  return { ...transfer };
}

onNet(events.BANK_FETCH_TRANSACTIONS, async () => {
  const _source = getSource();
  try {
    const _identifier = await getIdentifier(_source);
    const transfer = await fetchAllTransactions(_identifier);

    emitNet(events.BANK_SEND_TRANSFERS, _source, transfer);
  } catch (e) {
    bankLogger.error(`Failed to fetch transactions, ${e.message}`, {
      source: _source,
    });
  }
});

onNet(events.BANK_ADD_TRANSFER, async (transfer: Transfer) => {
  const _source = getSource();
  const xTarget = ESX.GetPlayerFromId(transfer.targetID);
  try {
    const _identifier = getIdentifier(_source);
    const transferNotify = await addTransfer(_identifier, transfer);
    emitNet(events.BANK_TRANSACTION_NOTIFICATION, xTarget, transferNotify);
    emitNet(events.BANK_ADD_TRANSFER_SUCCESS, _source);
  } catch (e) {
    bankLogger.error(`Failed to add transaction, ${e.message}`, {
      source: _source,
    });
    emitNet(events.BANK_TRANSACTION_ALERT, _source, false);
  }
});

onNet(events.BANK_GET_CREDENTIALS, () => {
  const _source = getSource();
  try {
    const credentials = fetchCredentials();
    emitNet(events.BANK_SEND_CREDENTIALS, _source, credentials);
  } catch (e) {
    bankLogger.error(`Failed to fetch credentials, ${e.message}`, {
      source: _source,
    });
  }
});
