import { type Context, getEventContext } from "./context";

type Event<T = unknown> = {
	body: T;
	ctx: Context;
};

export function eventController<TData, TResponse = void>(
	event: string,
	callback: (req: Event<TData>) => Promise<TResponse>,
) {
	onNet(event, async (responseEvent: string, data: TData) => {
		const ctx = getEventContext();

		// TODO: Add status codes or something to the response
		const response = await callback({
			body: data,
			ctx: ctx,
		});

		return emitNet(responseEvent, ctx.source, response);
	});
}
