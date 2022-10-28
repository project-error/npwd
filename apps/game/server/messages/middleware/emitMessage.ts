import { EmitMessageExportCtx } from '@typings/messages';
import PlayerService from '../../players/player.service';
import MessagesService from '../messages.service';
import { messagesLogger } from '../messages.utils';
import { OnMessageExportMap } from './onMessage';

const exp = global.exports;

// FIXME: Fix this, oh wait, no one contributes anymore
exp('emitMessage', async ({ senderNumber, targetNumber, message, embed }: EmitMessageExportCtx) => {
  await MessagesService.handleEmitMessage({
    senderNumber,
    targetNumber,
    message,
    embed: embed && JSON.stringify(embed),
  }).then(async () => {
    const funcRef = OnMessageExportMap.get(targetNumber);

    const senderIdentifier = await PlayerService.getIdentifierByPhoneNumber(senderNumber, false);
    const senderPlayer = PlayerService.getPlayerFromIdentifier(senderIdentifier);

    if (funcRef) {
      try {
        await funcRef({
          data: { embed, message, sourcePhoneNumber: senderNumber, tgtPhoneNumber: targetNumber },
          source: senderPlayer.source,
        });
      } catch (e) {
        messagesLogger.error(
          `Failed to find a callback reference for onMessage. Probably because the resource(s) using the export was stopped or restarted. Please restart said resource(s). Error: ${e.message}`,
        );
      }
    }
  });
});
