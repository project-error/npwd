
import events from '../utils/events';
import { ESX } from './server';
import { getSource } from "./functions";
import { pool } from './db';
import { usePhoneNumber } from './functions';


interface Listing {
  title: string;
  name: string;
  url?: string;
  description: string;
}


async function fetchAllListings(): Promise<Listing[]> {
  const query = "SELECT * FROM npwd_sellout_listings ORDER BY id DESC";

  const [ results ] = await pool.query(query);
  const listings = <Listing[]>results;

  return listings;
}

async function addListing(identifier: string, name: string, number: any, listing: Listing): Promise<any> {
  const query = "INSERT INTO npwd_sellout_listings (identifier, name, number, title, url, description) VALUES (?, ?, ?, ?, ?, ?)"
  await pool.query(query, [
    identifier, 
    name,
    number,
    listing.title, 
    listing.url, 
    listing.description,
  ])
} 

onNet(events.SELLOUT_FETCH_LISTING, async () => {
  try {
    const _source = (global as any).source;
    const listings = await fetchAllListings();
    emitNet(events.SELLOUT_SEND_LISTING, _source, listings)

  } catch(error) {
    console.log(error)
  }
})

onNet(events.SELLOUT_ADD_LISTING, async (listing: Listing) => {
  try {
    const xPlayer = ESX.GetPlayerFromId(getSource())
    const _identifier = xPlayer.getIdentifier()
    const name = xPlayer.getName()
  
    const phoneNumber = await usePhoneNumber(_identifier)
    addListing(_identifier, name, phoneNumber, listing)
  } catch (error) {
   console.log("Failed to add contact: ", error) 
  }
})