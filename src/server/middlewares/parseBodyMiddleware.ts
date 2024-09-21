import { handleError } from '../utils/errors';

export const parseBodyMiddleware = async (ctx, next) => {
  if (ctx.request.body) {
    await next();
    return;
  }
  try {
    const body = await ctx.request.body();
    ctx.request.body = await body.value;
    await next();
  } catch (error) {
    handleError(error, ctx);
  }
};
