import { ESX } from './server';
import { pool } from './db';
import events from '../utils/events';
import { useIdentifier, getSource } from './functions';
import { mainLogger } from './sv_logger';

const contactsLogger = mainLogger.child({ module: 'contact' });

interface Contacts {
  id?: number;
  display: string;
  number: string;
  avatar: string;
}

interface ContactId {
  id: number;
}

async function fetchAllContacts(identifier: string): Promise<Contacts[]> {
  const query = 'SELECT * FROM npwd_phone_contacts WHERE identifier = ?';
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
    'INSERT INTO npwd_phone_contacts (identifier, number, display, avatar) VALUES (?, ?, ?, ?)';

  const [result] = await pool.query(query, [
    identifier,
    number,
    display,
    avatar,
  ]);
}

async function updateContact(
  contact: Contacts,
  identifier: string
): Promise<any> {
  const query =
    'UPDATE npwd_phone_contacts SET number = ?, display = ?, avatar = ? WHERE id = ? AND identifier = ?';
  await pool.query(query, [
    contact.number,
    contact.display,
    contact.avatar,
    contact.id,
    identifier,
  ]);
}

async function deleteContact(
  contact: ContactId,
  identifier: string
): Promise<any> {
  const query =
    'DELETE FROM npwd_phone_contacts WHERE id = ? AND identifier = ?';
  await pool.query(query, [contact.id, identifier]);
}

onNet(events.CONTACTS_GET_CONTACTS, async () => {
  try {
    const _source = (global as any).source;
    const xPlayer = ESX.GetPlayerFromId(_source);
    const _identifier = xPlayer.getIdentifier();

    const contacts = await fetchAllContacts(_identifier);
    emitNet(events.CONTACTS_SEND_CONTACTS, _source, contacts);
  } catch (e) {
    contactsLogger.error(`Failed to fetch contacts, ${e.message}`);
  }
});

onNet(
  events.CONTACTS_ADD_CONTACT,
  async (number: string, display: string, avatar: string) => {
    try {
      const _source = (global as any).source;
      const _identifier = await useIdentifier();
      addContact(_identifier, number, display, avatar);
      emitNet(events.CONTACTS_ADD_CONTACT_SUCCESS, _source);
      emitNet(events.CONTACTS_ACTION_RESULT, _source, 'CONTACT_ADD_SUCCESS');
    } catch (e) {
      const _source = (global as any).source;
      emitNet(events.CONTACTS_ACTION_RESULT, _source, 'CONTACT_ADD_FAILED');
      contactsLogger.error(`Failed to add contact, ${e.message}`);
    }
  }
);

onNet(events.CONTACTS_UPDATE_CONTACT, async (contact: Contacts) => {
  try {
    const _source = (global as any).source;
    const _identifier = ESX.GetPlayerFromId(_source).getIdentifier();
    // console.log('nice identifier bro', _identifier);
    await updateContact(contact, _identifier);
    // console.log('i updated the contact server side!');

    emitNet(events.CONTACTS_UPDATE_CONTACT_SUCCESS, _source);
    // console.log('ffs, didd it return successful');

    emitNet(events.CONTACTS_ACTION_RESULT, _source, 'CONTACT_UPDATE_SUCCESS');
    // console.log('UPDATED CONTACT: ', contact);
  } catch (e) {
    const _source = (global as any).source;
    emitNet(events.CONTACTS_ACTION_RESULT, _source, 'CONTACT_UPDATE_FAILED');
    contactsLogger.error(`Failed to update contact, ${e.message}`);
  }
});

onNet(events.CONTACTS_DELETE_CONTACT, async (contact: ContactId) => {
  try {
    const _identifier = await useIdentifier();
    deleteContact(contact, _identifier);
    emitNet(events.CONTACTS_DELETE_CONTACT_SUCCESS, getSource());
    emitNet(
      events.CONTACTS_ACTION_RESULT,
      getSource(),
      'CONTACT_DELETE_SUCCESS'
    );
  } catch (e) {
    contactsLogger.error(`Failed to delete contact, ${e.message}`);
    emitNet(
      events.CONTACTS_ACTION_RESULT,
      getSource(),
      'CONTACT_DELETE_FAILED'
    );
  }
});
