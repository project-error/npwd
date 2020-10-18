import events from '../utils/events';
import { ESX, getSource } from './server';
import { pool } from './db';


interface IListing {
  title: string;
  name: string;
  url: string;
  description: string;
}

async function addListing(identifier: string, name: string, title: string, url: string, description: string): Promise<any> {
  const query = "INSERT INTO npwd_sellout_listings (identifier, name, title, url, description) VALUES (?, ?, ?, ?, ?)"
  console.log("hallllllollooooo");
  await pool.query(query, [identifier, name, title, url, description])
} 

async function fetchAllListings(): Promise<IListing[]> {
  const query = "SELECT * FROM npwd_sellout_listings ORDER BY id DESC";

  const [ results ] = await pool.query(query);
  const listings = <IListing[]>results;

  return listings;
}

onNet(events.SELLOUT_ADD_LISTING, (data: any) => {
  try {
    const xPlayer = ESX.GetPlayerFromId(getSource())
    const _identifier = xPlayer.getIdentifier()
    const name = xPlayer.getName()
    console.log("ADDED")
  
    addListing(_identifier, name, data.title, data.url, data.desc) 
  } catch (error) {
   console.log(error) 
  }
})

onNet(events.SELLOUT_FETCH_LISTING, async () => {
  try {
    console.log("Fetching all listings")
    const listings = await fetchAllListings();
    console.log("ADDED")
    emitNet(events.SELLOUT_SEND_LISTING, getSource(), listings)

  } catch(error) {
    console.log(error)
  }
})