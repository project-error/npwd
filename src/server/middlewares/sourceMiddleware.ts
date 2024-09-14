import { RouterContext } from 'fivem-router';

export const sourceMiddleware = async (ctx: RouterContext, next: () => Promise<void>) => {
  const headerSource = parseInt(ctx.request?.headers?.['x-source'] ?? '0', 10);
  const _source = (!isNaN(headerSource) && headerSource) || global.source || ctx.source;
  if (!_source) {
    ctx.throw(401, 'Source not found. Are you calling this from the server?');
    return;
  }

  ctx.source = _source;

  await next();
};
