import events from '../utils/events';
import { ESX, getSource } from './server';
import { pool } from './db';
import { Transfer, Credentials } from '../../phone/src/common/interfaces/bank';


async function fetchAllTransactions(identifier: string): Promise<Transfer[]> {
  const query = "SELECT * FROM npwd_bank_transfers WHERE identifier = ? ORDER BY id DESC"
  const [ results ] = await pool.query(query, [identifier])
  const transactions = <Transfer[]>results;

  return transactions;
}

function fetchCredentials(): Credentials {
  const name = ESX.GetPlayerFromId(getSource()).getName();
  const balance = ESX.GetPlayerFromId(getSource()).getAccount('bank').money

  const result = {
    name,
    balance
  }

  console.log(result.name, result.balance);

  return result;
}

async function addTransfer(identifier: string, transfer: Transfer): Promise<any> {
  const xPlayer = ESX.GetPlayerFromId(getSource())
  const bankBalance = xPlayer.getAccount('bank').money;
  const sourceName = xPlayer.getName()

  if (transfer.amount > bankBalance) {
    console.log("poor man")
    emitNet(events.BANK_TRANSACTION_ALERT, getSource(), false)
  } 
  else if (transfer.amount < bankBalance) {
    emitNet(events.BANK_TRANSACTION_ALERT, getSource(), true)


    const query = "INSERT INTO npwd_bank_transfers (identifier, target, amount, message, type, source) VALUES (?, ?, ?, ?, ?, ?)"
    // emit alert to target iD
    console.log("rich man")
  
    const [results] = await pool.query(query, [
      identifier, 
      transfer.targetID,
      transfer.amount,
      transfer.message,
      "Deposit",
      sourceName,
    ])
    const insertData = <any>results;
    console.log("ID: ", insertData.insertId)
    return await getTransfer(insertData.insertId)
    //xTarget.addAccountMoney('bank', transfer.amount)
  }
}

/**
 * Gets a transfer from its ID
 * @param transferId - transfer id
 */
async function getTransfer(transferId: number): Promise<Transfer> {
  const query = "SELECT * FROM npwd_bank_transfers WHERE id = ?"
  const [ results ] = await pool.query(query, [transferId]);
  const transfers = <Transfer[]>results;
  const transfer = transfers[0];
  return {...transfer};
}

onNet(events.BANK_FETCH_TRANSACTIONS, async () => {
  try {
    const _source = (global as any).source;
    const _identifier = ESX.GetPlayerFromId(getSource()).getIdentifier()
    const transfer = await fetchAllTransactions(_identifier);

    emitNet(events.BANK_SEND_TRANSFERS, _source, transfer)

  } catch (error) {
    console.log('Failed to fetch transactions', error)
  }
})

onNet(events.BANK_ADD_TRANSFER, async (transfer: Transfer) => {
  try {
    const _identifier = ESX.GetPlayerFromId(getSource()).getIdentifier()
    const transferNotify = await addTransfer(_identifier, transfer)
    console.log(transferNotify.id)
    emitNet(events.BANK_TRANSACTION_NOTIFICATION, getSource(), transferNotify)
  } catch (error) {
    console.log('Failed to add transfer', error)
  }
})

onNet(events.BANK_GET_CREDENTIALS, () => {
  try {
    const credentials = fetchCredentials()
    console.log("New log: ", credentials.balance, credentials.name)
    emitNet(events.BANK_SEND_CREDENTIALS, getSource(), credentials)
  } catch (error) {
    console.log(error)
  }
})