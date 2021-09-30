import { mainLogger } from '../sv_logger';

const profilerLog = mainLogger.child({ module: 'profiler' });

const RESOURCE_NAME = GetCurrentResourceName();

// Simple higher order function profiler
// currently targeted towards ms as unit and db queries
// but can be altered to be generic in future
export const withProfile = async (fn: Function, ...args: any[]) => {
  const startTime = process.hrtime.bigint();

  // https://forum.cfx.re/t/node-mysql2-question-about-performance-process-nexttick/4550064/2?u=taso
  ScheduleResourceTick(RESOURCE_NAME);
  const res = await fn(...args);

  const endTime = process.hrtime.bigint();

  const timeMs = Number(endTime - startTime) / 1e6;

  profilerLog.info(`Executed '${fn.name} (${[...args].join(', ')}) in ${timeMs}ms'`);

  return res;
};
