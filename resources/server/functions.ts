import  { pool } from './db';
import { ESX } from "./server";

interface IPhoneNumber {
  phone_number: string;
}

interface Iidentifier {
  identifier: string;
}

export async function usePhoneNumber(identifier: string): Promise<string> {
  const query = "SELECT phone_number FROM users WHERE identifier = ?"
  const [results] = await pool.query(query, [identifier]);
  const phoneNumber = <IPhoneNumber[]>results;
  return phoneNumber[0].phone_number;
}

export const getSource = () => parseInt(source);

export async function useIdentifier(): Promise<string> {
  return ESX.GetPlayerFromId(getSource()).getIdentifier();
  const identifier = await ESX.GetPlayerFromId(getSource()).getIdentifier()
  return identifier;
}

export async function getIdentifierByPhoneNumber(phoneNumber: string): Promise<string> {
  const query = "SELECT identifier FROM users WHERE phone_number = ?"
  const [results] = await pool.query(query, [phoneNumber]);
  const identifier = <Iidentifier[]>results;
  return identifier[0].identifier;
}