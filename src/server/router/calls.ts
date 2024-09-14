import { Router } from 'fivem-router';
import CallService from '../services/CallService';
import { z } from 'zod';
import { handleError } from '../utils/errors';
import { getPlayerSrcBySid } from '../utils/player';
import { parseObjectToIsoString } from '../utils/date';

/** add pma exports to global */
declare global {
  interface CitizenExports {
    'pma-voice'?: {
      setPlayerCall: (source: number, channelId: number) => void;
    };
  }
}

export const callsRouter = new Router({
  prefix: '/calls',
});

const responseCallSchema = z.object({
  callId: z.coerce.number(),
});

// callsRouter.add('/:callId', async (ctx, next) => {
//   try {
//     const { callId } = responseCallSchema.parse(ctx.params);
//     const call = await CallService.getCallById(ctx, callId);

//     ctx.body = {
//       ok: true,
//       payload: call,
//     };
//   } catch (error) {
//     handleError(error, ctx);
//   }

//   await next();
// });

const initiateCallSchema = z.object({
  phoneNumber: z.string().min(2).max(15),
});

callsRouter.add('/call', async (ctx, next) => {
  try {
    const { phoneNumber } = initiateCallSchema.parse(ctx.request.body);
    const call = await CallService.call(ctx, phoneNumber.toString());

    const callerSrc = await getPlayerSrcBySid(call.caller_id);
    const receiverSrc = await getPlayerSrcBySid(call.receiver_id);

    ctx.emitToNui(callerSrc, 'active-call:updated', parseObjectToIsoString(call));
    ctx.emitToNui(receiverSrc, 'active-call:updated', parseObjectToIsoString(call));

    ctx.status = 200;
    ctx.body = {
      ok: true,
      payload: call,
    };
    return;
  } catch (error) {
    handleError(error, ctx);
  }

  await next();
});

callsRouter.add('/my-calls', async (ctx, next) => {
  try {
    const calls = await CallService.getMyCalls(ctx);

    ctx.status = 200;
    ctx.body = {
      ok: true,
      payload: calls,
    };
  } catch (error) {
    handleError(error, ctx);
  }

  await next();
});

// callsRouter.add('/:callId/accept', async (ctx, next) => {
//   try {
//     const { callId } = responseCallSchema.parse(ctx.params);
//     const call = await CallService.acceptCall(ctx, callId);

//     ctx.body = {
//       ok: true,
//       payload: call,
//     };
//   } catch (error) {
//     handleError(error, ctx);
//   }

//   await next();
// });

// callsRouter.add('/:callId/end', async (ctx, next) => {
//   try {
//     const { callId } = responseCallSchema.parse(ctx.params);
//     const call = await CallService.endCall(ctx, callId);

//     ctx.body = {
//       ok: true,
//       payload: call,
//     };
//   } catch (error) {
//     handleError(error, ctx);
//   }
// });

// callsRouter.add('/:callId/decline', async (ctx, next) => {
//   try {
//     const { callId } = responseCallSchema.parse(ctx.params);
//     const call = await CallService.declineCall(ctx, callId);

//     ctx.body = {
//       ok: true,
//       payload: call,
//     };
//   } catch (error) {
//     handleError(error, ctx);
//   }
// });

// callsRouter.add('/:callId/acknowledge', async (ctx, next) => {
//   try {
//     const { callId } = responseCallSchema.parse(ctx.params);
//     const call = await CallService.acknowledgeCall(ctx, callId);

//     ctx.body = {
//       ok: true,
//       payload: call,
//     };
//   } catch (error) {
//     handleError(error, ctx);
//   }
// });

callsRouter.add('/acknowledge-all', async (ctx, next) => {
  try {
    const calls = await CallService.acknowledgeMissedCalls(ctx);

    ctx.body = {
      ok: true,
      payload: calls,
    };
  } catch (error) {
    handleError(error, ctx);
  }

  await next();
});

callsRouter.add('/pending', async (ctx, next) => {
  try {
    const calls = await CallService.getPendingCalls(ctx);

    ctx.body = {
      ok: true,
      payload: calls,
    };
  } catch (error) {
    handleError(error, ctx);
  }

  await next();
});

callsRouter.add('/missed', async (ctx, next) => {
  try {
    const calls = await CallService.getMissedCalls(ctx);

    ctx.status = 200;
    ctx.body = {
      ok: true,
      payload: calls,
    };
  } catch (error) {
    handleError(error, ctx);
  }
});
