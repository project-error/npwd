import { ESX } from './server';
import { pool } from './db';
import events from '../utils/events';
import { getIdentifier, getSource } from './functions';
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
   const query = 'SELECT * FROM npwd_phone_contacts WHERE identifier = ? ORDER BY display ASC';
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
  const _source = getSource();
  try {
    const _identifier = getIdentifier(_source);

    const contacts = await fetchAllContacts(_identifier);
    emitNet(events.CONTACTS_SEND_CONTACTS, _source, contacts);
  } catch (e) {
    contactsLogger.error(`Failed to fetch contacts, ${e.message}`);
  }
});

onNet(
  events.CONTACTS_ADD_CONTACT,
  async (number: string, display: string, avatar: string) => {
    const _source = getSource();
    try {
      const _identifier = getIdentifier(_source);
      await addContact(_identifier, number, display, avatar);
      emitNet(events.CONTACTS_ADD_CONTACT_SUCCESS, _source);
      emitNet(events.CONTACTS_ACTION_RESULT, _source, {
        message: 'CONTACT_ADD_SUCCESS',
        type: 'success'
      });
    } catch (e) {
      emitNet(events.CONTACTS_ACTION_RESULT, _source, {
        message: 'CONTACT_ADD_FAILED',
        type: 'error'
      });
      contactsLogger.error(`Failed to add contact, ${e.message}`, {
        source: _source,
      });
    }
  }
);

onNet(events.CONTACTS_UPDATE_CONTACT, async (contact: Contacts) => {
  const _source = getSource();
  try {
    const _identifier = ESX.GetPlayerFromId(_source).getIdentifier();
    // console.log('nice identifier bro', _identifier);
    await updateContact(contact, _identifier);
    // console.log('i updated the contact server side!');

    emitNet(events.CONTACTS_UPDATE_CONTACT_SUCCESS, _source);
    // console.log('ffs, didd it return successful');

    emitNet(events.CONTACTS_ACTION_RESULT, _source, {
      message: 'CONTACT_UPDATE_SUCCESS',
      type: 'success'
    });
    // console.log('UPDATED CONTACT: ', contact);
  } catch (e) {
    const _source = (global as any).source;
    emitNet(events.CONTACTS_ACTION_RESULT, _source, {
      message: 'CONTACT_UPDATE_FAILED',
      type: 'error'
    });
    contactsLogger.error(`Failed to update contact, ${e.message}`, {
      source: _source,
    });
  }
});

onNet(events.CONTACTS_DELETE_CONTACT, async (contact: ContactId) => {
  const _source = getSource();
  try {
    const _identifier = await getIdentifier(_source);
    await deleteContact(contact, _identifier);
    emitNet(events.CONTACTS_DELETE_CONTACT_SUCCESS, _source);
    emitNet(events.CONTACTS_ACTION_RESULT, _source, {
      message: 'CONTACT_DELETE_SUCCESS',
      type: 'success'
    });
  } catch (e) {
    contactsLogger.error(`Failed to delete contact, ${e.message}`, {
      source: _source,
    });
    emitNet(events.CONTACTS_ACTION_RESULT, _source, {
      message: 'CONTACT_DELETE_FAILED',
      type: 'error'
    });
  }
});
