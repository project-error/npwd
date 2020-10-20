import events from '../utils/events';
import { ESX, getSource } from './server';
import { pool } from './db';

interface Transfer {
  targetID: string;
  amount: number;
  message: string;
}

async function fetchAllTransactions(identifier: string): Promise<Transfer[]> {
  const query = "SELECT * FROM npwd_bank_transfers WHERE identifier = ? ORDER BY id DESC"
  const [ results ] = await pool.query(query, [identifier])
  const transactions = <Transfer[]>results;

  return transactions;

}





async function addTransfer(identifier: string, transfer: Transfer): Promise<any> {

  const xPlayer = ESX.GetPlayerFromId(getSource())
  const bankBalance = xPlayer.getAccount('bank').money;
  console.log(bankBalance)
  if (transfer.amount > bankBalance) {
    console.log("poor man")
    emitNet(events.BANK_TRANSACTION_ALERT, getSource, 'You do not have enough money on your account', 'error')
  } 
  else if (transfer.amount <= bankBalance) {
    const query = "INSERT INTO npwd_bank_transfers (identifier, target, amount, message) VALUES (?, ?, ?, ?)"
  
    await pool.query(query, [
      identifier, 
      transfer.targetID,
      transfer.amount,
      transfer.message
    ])
    emitNet(events.BANK_TRANSACTION_ALERT, getSource, 'You succesfully transferred money to someone', 'success')
  }
}

onNet(events.BANK_FETCH_TRANSACTIONS, async () => {
  try {
    const _source = (global as any).source;
    const _identifier = ESX.GetPlayerFromId(getSource()).getIdentifier()
    const transfer = await fetchAllTransactions(_identifier);

    emitNet(events.BANK_SEND_TRANSFERS, _source, transfer)
    console.log("WOORK")

  } catch (error) {
    console.log('Failed to fetch transactions', error)
  }
})

onNet(events.BANK_ADD_TRANSFER, (transfer: Transfer) => {
  try {
    const _identifier = ESX.GetPlayerFromId(getSource()).getIdentifier()
    addTransfer(_identifier, transfer)
  } catch (error) {
    console.log('Failed to add transfer', error)
  }
})