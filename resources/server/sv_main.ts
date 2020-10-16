import { ESX } from './server';
import { pool } from './db';

//db = DatabaseConfig  //helper variable for use in server function

//we pass the server configuration to the phone so that we can have phone or
//app specific settings configured by the server owner
//ESX.RegisterServerCallback('phone:phoneConfig', function(source, cb) {
//    cb(Config)
//});

interface Credentials {
  phone_number: string;
}

async function getCredentials(identifier: string) : Promise<string> { 
  const query = "SELECT phone_number FROM users WHERE identifier = ?";
  const [ result ] = await pool.query(query, [identifier]);
  const number = <Credentials[]>result;
  if (number.length === 0) return "###-####";
  return number[0].phone_number;
}

onNet('phone:getCredentials', async () => {
  try {
    const _source = (global as any).source;
    const xPlayer = ESX.GetPlayerFromId(_source);
    const _identifier = xPlayer.getIdentifier();
    const number = await getCredentials(_identifier);
    emitNet('phone:sendCredentials', _source, number)
  } catch (error) {
    console.log('Failed to get number. ', error);
  };
});


//
//ESX.RegisterServerCallback('phone:getItemAmount', function(source, cb, item)
//    local xPlayer = ESX.GetPlayerFromId(source)
//    local items = xPlayer.getInventoryItem(item)
//
//    if items == nil then
//        cb(0)
//    else
//        cb(items.count)
//    end
//end)
//
//----
//--Destroy Phone
//--
//
//ESX.RegisterServerCallback('phone:removephone', function(source, cb, item)
//    local xPlayer = ESX.GetPlayerFromId(source)
//    local items = xPlayer.getInventoryItem(item)
//
//    if items == nil then
//        cb(0)
//    else
//        cb(items.count)
//        if items.count > 0 then
//            xPlayer.removeInventoryItem('phone', items.count)
//            xPlayer.addInventoryItem('dphone', items.count)
//        end
//    end
//end)