import { RouterContext } from 'fivem-router';
import { isRunningInGame } from '../utils/game';

export const emitMiddleware = async (ctx: RouterContext, next: CallableFunction) => {
  /** If not ingame, add mock functions on CTX */
  if (!isRunningInGame()) {
    ctx.emit = () => {};
    ctx.emitNui = () => {};
    ctx.emitTo = () => {};
    ctx.emitToNui = () => {};
  }

  await next();
};
