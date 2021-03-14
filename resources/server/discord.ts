import axios, { AxiosResponse } from 'axios';

import { Tweet, Profile } from '../../typings/twitter';
import { IMAGE_DELIMITER } from '../../phone/src/apps/twitter/utils/images';
import { mainLogger } from './sv_logger';
import { MarketplaceListing } from '../../typings/marketplace';

const discordLogger = mainLogger.child({ module: 'discord' });

const DISCORD_WEBHOOK_ENV_VAR = 'NPWD_DISCORD_TOKEN';
const DISCORD_WEBHOOK = GetConvar(DISCORD_WEBHOOK_ENV_VAR, '');
/**
 * https://discord.com/developers/docs/resources/channel#embed-object-embed-field-structure
 */
interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

interface DiscordEmbed {
  title: string;
  color: number;
  description: string;
  timestamp: string;
  fields: DiscordEmbedField[];
}

interface DiscordMessage {
  username: string;
  embeds: DiscordEmbed[];
}

const postToWebhook = async (content: DiscordMessage): Promise<AxiosResponse | void> => {
  // If convar isnt set
  if (!DISCORD_WEBHOOK) {
    discordLogger.warn(
      'Got a request to report a listing but discord is not configures. See README o how to configure discord endpoints.',
    );
    return;
  }
  const resp = await axios.post(DISCORD_WEBHOOK, { ...content });
  // If we get a bad request throw error
  if (resp.status >= 200 && resp.status < 300)
    throw new Error(`Discord Error: ${resp.status} Error - ${resp.statusText}`);
};

const createDiscordMsgObj = (type: string, message: string, fields: DiscordEmbedField[]) => {
  // Get ISO 8601 as its required by Discord API
  const curTime = new Date().toISOString();

  return {
    username: 'NPWD Report',
    embeds: [
      {
        title: `${type} REPORT`,
        color: 0xe74c3c,
        description: message,
        timestamp: curTime,
        fields,
      },
    ],
  };
};

export async function reportTweetToDiscord(tweet: Tweet, reportingProfile: Profile): Promise<any> {
  // TODO: Add image report functionality
  const fields = [
    {
      name: 'Reporting User',
      value: `${tweet.profile_name} (${tweet.profile_id})`,
    },
    {
      name: 'Reported User',
      value: `${tweet.profile_name} (${tweet.profile_id})`,
    },
    {
      name: 'Tweet',
      value: tweet.message,
    },
  ];

  // If the tweet has images add it to the field array
  if (tweet.images)
    fields.concat({
      name: 'Images',
      value: tweet.images.split(IMAGE_DELIMITER).join('\n'),
    });

  const msgObj = createDiscordMsgObj('TWITTER', `Received a report for a tweet`, fields);
  try {
    await postToWebhook(msgObj);
  } catch (e) {
    discordLogger.error(e.message);
  }
}

export async function reportListingToDiscord(
  listing: MarketplaceListing,
  reportingProfile: string,
): Promise<void> {
  const embedObj = createDiscordMsgObj('MARKETPLACE', 'Received a report for a listing', [
    {
      name: 'Reported By',
      value: reportingProfile,
      inline: true,
    },
    {
      name: 'Reported User',
      value: `${listing.name} - (${listing.username})`,
      inline: true,
    },
    {
      name: 'Reported Listing Title',
      value: listing.title,
    },
    {
      name: 'Reported Listing Desc.',
      value: listing.description,
    },
  ]);

  try {
    await postToWebhook(embedObj);
  } catch (e) {
    discordLogger.error(e.message);
  }
}
