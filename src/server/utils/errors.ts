import { RouterContext } from 'fivem-router';
import { ZodError } from 'zod';
import { BaseError } from '../../shared/Errors';

export const handleError = (
  error: Error | ZodError | BaseError,
  ctx: Pick<RouterContext, 'status' | 'body'>,
) => {
  if (error instanceof ZodError) {
    ctx.status = 400;
    ctx.body = {
      ok: false,
      error: error.errors,
    };
    return;
  }

  if ('error_code' in error) {
    ctx.status = error.code;
    ctx.body = {
      ok: false,
      message: error.message,
      error: error.error_code,
    };

    return;
  }

  ctx.status = 500;
  ctx.body = {
    ok: false,
    message: error.message,
    error: error.message,
  };
};
