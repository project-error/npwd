import { initRouter } from '@core/router';
import { notesRouter } from './notes/notes.controller';

const t = initRouter.create();

export const router = t.router;
export const eventProcedure = t.eventProcedure;

const appRouter = router({
  notes: notesRouter,
});

export type AppRouter = typeof appRouter;
