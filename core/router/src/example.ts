import { initRouter } from '.';

const t = initRouter.create();
const router = t.router;

const eventProcedure = t.eventProcedure;

type PlayerData = {
  playerId: number;
  amount: number;
};

const appRouter = router({
  giveMoney: eventProcedure('giveMoney', async (data: PlayerData) => {
    console.log('Giving money to player: ', data.playerId, data.amount);
  }),
});

export type AppRouter = typeof appRouter;
