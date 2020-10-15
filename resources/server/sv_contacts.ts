import { ESX } from './server';
import { pool } from './db';
import events from '../utils/events';


interface Contacts {
  display: string;
  number: string;
}

async function fetchAllContacts(identifier: string) : Promise<Contacts[]> {
  const query = "SELECT * FROM npwd_phone_contacts WHERE identifier = ?";
  const [ results ] = await pool.query(query, [identifier]);
  const contacts = <Contacts[]>results;
  return contacts;
}

onNet(events.CONTACTS_GET_CONTACTS, async (callback: any) => {
  try {
    const _source = (global as any).source;
    const xPlayer = ESX.GetPlayerFromId(_source);
    const _identifier = xPlayer.getIdentifier();

    const contacts = await fetchAllContacts(_identifier);
    console.log("Contacts: ")
    contacts.forEach(element => {
      console.log(element.display, element.number);
    });
    emitNet(events.CONTACTS_SEND_CONTACTS, _source, contacts)

  } catch(error) {
    console.log("Failed to fetch contacts: ", error);
  }

})

//RegisterServerEvent('phone:addContacts')
//AddEventHandler('phone:addContacts', function(display, number)
//    local _source = source
//    local xPlayer = ESX.GetPlayerFromId(_source)
//    local _identifier = xPlayer.getIdentifier()
//    print(display, number)
//    MySQL.Async.execute('INSERT INTO npwd_phone_contacts (`identifier`, `number`, `display`) VALUES (@identifier, @number, @display)', 
//    {  
//        identifier = _identifier,
//        number = number,
//        display = display
//    }, function()
//    end)
//end)
