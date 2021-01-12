import events from "../utils/events";
import { ESX } from "./server";
import { getSource } from "./functions";
import { pool } from "./db";
import {
  Transfer,
  IBankCredentials,
} from "../../phone/src/common/typings/bank";
import { useIdentifier } from "./functions";
import { type } from "os";

async function fetchAllTransactions(identifier: string): Promise<Transfer[]> {
  const query =
    "SELECT * FROM npwd_bank_transfers WHERE identifier = ? ORDER BY id DESC";
  const [results] = await pool.query(query, [identifier]);
  const transactions = <Transfer[]>results;

  return transactions;
}

function fetchCredentials(): IBankCredentials {
  const name = ESX.GetPlayerFromId(getSource()).getName();
  const balance = ESX.GetPlayerFromId(getSource()).getAccount("bank").money;

  const result = {
    name,
    balance,
  };

  return result;
}

async function addTransfer(
  identifier: string,
  transfer: Transfer
): Promise<any> {
  const xPlayer = ESX.GetPlayerFromId(getSource());
  const bankBalance = xPlayer.getAccount("bank").money;
  const sourceName = xPlayer.getName();

  const xTarget = ESX.GetPlayerFromId(transfer.targetID);

  if (transfer.transferAmount > bankBalance) {
    emitNet(events.BANK_TRANSACTION_ALERT, getSource(), false);
  } else if (transfer.transferAmount < bankBalance) {
    emitNet(events.BANK_TRANSACTION_ALERT, getSource(), true);

    xTarget.addAccountMoney("bank", transfer.transferAmount);
    xPlayer.removeAccountMoney("bank", transfer.transferAmount);

    const query =
      "INSERT INTO npwd_bank_transfers (identifier, target, amount, message, type, source) VALUES (?, ?, ?, ?, ?, ?)";

    const [results] = await pool.query(query, [
      identifier,
      transfer.targetID,
      transfer.transferAmount,
      transfer.message,
      "Transfer",
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
  const query = "SELECT * FROM npwd_bank_transfers WHERE id = ?";
  const [results] = await pool.query(query, [transferId]);
  const transfers = <Transfer[]>results;
  const transfer = transfers[0];
  return { ...transfer };
}

onNet(events.BANK_FETCH_TRANSACTIONS, async () => {
  try {
    const _source = (global as any).source;
    const _identifier = await useIdentifier();
    const transfer = await fetchAllTransactions(_identifier);

    emitNet(events.BANK_SEND_TRANSFERS, _source, transfer);
  } catch (error) {
    console.log("Failed to fetch transactions");
  }
});

onNet(events.BANK_ADD_TRANSFER, async (transfer: Transfer) => {
  const xTarget = ESX.GetPlayerFromId(transfer.targetID);
  try {
    const _identifier = await useIdentifier();
    const transferNotify = await addTransfer(_identifier, transfer);
    emitNet(events.BANK_TRANSACTION_NOTIFICATION, xTarget, transferNotify);
    emitNet(events.BANK_ADD_TRANSFER_SUCCESS, getSource());
  } catch (error) {
    emitNet(events.BANK_TRANSACTION_ALERT, getSource(), false);
  }
});

onNet(events.BANK_GET_CREDENTIALS, () => {
  try {
    const credentials = fetchCredentials();
    emitNet(events.BANK_SEND_CREDENTIALS, getSource(), credentials);
  } catch (error) {
    console.log("Failed to fetch credentials");
  }
});
