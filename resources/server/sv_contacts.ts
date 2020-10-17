import { ESX } from "./server";
import { pool } from "./db";
import events from "../utils/events";

interface Contacts {
  display: string;
  number: string;
}

async function fetchAllContacts(identifier: string): Promise<Contacts[]> {
  const query = "SELECT * FROM npwd_phone_contacts WHERE identifier = ?";
  const [results] = await pool.query(query, [identifier]);
  const contacts = <Contacts[]>results;
  return contacts;
}

async function addContact(
  identifier: string,
  number: string,
  display: string,
  avatar: string
): Promise<any> {
  const query =
    "INSERT INTO npwd_phone_contacts (identifier, number, display, avatar) VALUES (?, ?, ?, ?)";

  await pool.query(query, [identifier, number, display, avatar]);
}

onNet(events.CONTACTS_GET_CONTACTS, async () => {
  try {
    const _source = (global as any).source;
    const xPlayer = ESX.GetPlayerFromId(_source);
    const _identifier = xPlayer.getIdentifier();

    const contacts = await fetchAllContacts(_identifier);
    emitNet(events.CONTACTS_SEND_CONTACTS, _source, contacts);
  } catch (error) {
    console.log("Failed to fetch contacts: ", error);
  }
});

onNet(
  events.CONTACTS_ADD_CONTACT,
  (number: string, display: string, avatar: string) => {
    try {
      const _source = (global as any).source;
      const xPlayer = ESX.GetPlayerFromId(_source);
      const _identifier = xPlayer.getIdentifier();
      addContact(_identifier, number, display, avatar);
      emit(events.CONTACTS_GET_CONTACTS);
    } catch (error) {
      console.log("Failed to add contact: ", error);
    }
  }
);
