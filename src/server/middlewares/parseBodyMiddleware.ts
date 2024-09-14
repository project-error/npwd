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
    ctx.throw(400, 'Invalid body');
  }
};
