import { ESX } from "./server";
import { pool } from "./db";

//db = DatabaseConfig  //helper variable for use in server function

//we pass the server configuration to the phone so that we can have phone or
//app specific settings configured by the server owner
//ESX.RegisterServerCallback('phone:phoneConfig', function(source, cb) {
//    cb(Config)
//});

interface Credentials {
  phone_number: string;
}

async function getCredentials(identifier: string): Promise<string> {
  const query = "SELECT phone_number FROM users WHERE identifier = ?";
  const [result] = await pool.query(query, [identifier]);
  const number = <Credentials[]>result;
  if (number.length === 0) return "###-####";
  return number[0].phone_number;
}

onNet("phone:getCredentials", async () => {
  try {
    const _source = (global as any).source;
    const xPlayer = ESX.GetPlayerFromId(_source);
    const _identifier = xPlayer.getIdentifier();
    const number = await getCredentials(_identifier);
    emitNet("phone:sendCredentials", _source, number);
  } catch (error) {
    console.log("Failed to get number. ", error);
  }
});
