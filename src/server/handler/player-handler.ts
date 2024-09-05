import { eventController } from "../event/eventController";

type PlayerTest = {
	name: string;
	phoneNumber: string;
};

type PlayerTestResponse = {
	message: string;
};

eventController<PlayerTest, PlayerTestResponse>(
	"player:test",
	async ({ ctx, body }) => {
		console.log(ctx.source);
		console.log(body.name, body.phoneNumber);

		return {
			message: "Hello, World!",
		};
	},
);
