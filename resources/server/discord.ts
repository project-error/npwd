import axios from 'axios';

import { Tweet, Profile } from '../../phone/src/common/typings/twitter';
import { IMAGE_DELIMITER } from '../../phone/src/apps/twitter/utils/images';
import { mainLogger } from './sv_logger';

const discordLogger = mainLogger.child({ module: 'discord' });

const DISCORD_TOKEN_ENV_VAR = 'discord_bot_token';
const DISCORD_TOKEN = GetConvar(DISCORD_TOKEN_ENV_VAR, '');
const DISCORD_CHANNEL_ENV_VAR = 'discord_channel_id';
const DISCORD_CHANNEL_ID = GetConvar(DISCORD_CHANNEL_ENV_VAR, '');
const DISCORD_HEADERS = { authorization: `Bot ${DISCORD_TOKEN}` };

const BASE_URL = 'https://discord.com/api';
const POST_CHANNEL_URL = `${BASE_URL}/channels/${DISCORD_CHANNEL_ID}/messages`;

export async function reportTweetToDiscord(
  tweet: Tweet,
  reportingProfile: Profile
): Promise<any> {
  if (!DISCORD_TOKEN || !DISCORD_CHANNEL_ID) {
    discordLogger.warn(`Got a request to report a tweet but discord is not 
        configured. See README on how to configure discord endpoints.`);
    return;
  }
  const content = `**REPORTED TWEET**
    ----------------------------------------------------------------------
    **Reporting User**: ${reportingProfile.profile_name} (${
    reportingProfile.id
  })
    **Reported User**: ${tweet.profile_name} (${tweet.profile_id})
    **Reported Tweet timestamp**: ${tweet.createdAt}
    ----------------------------------------------------------------------
    **Reported Message**:

    ${tweet.message}

    **Reported Images**:
    ${tweet.images.split(IMAGE_DELIMITER).join('\n')}
    `;

  return await axios.post(
    POST_CHANNEL_URL,
    { content },
    { headers: DISCORD_HEADERS }
  );
}
