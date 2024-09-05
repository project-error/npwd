import { customAlphabet } from "nanoid";

function uniqueId() {
	return customAlphabet("1234567890abcdef", 21);
}

export function netEventController<TResponse>(
	event: string,
	...args: any[]
): Promise<TResponse> {
	// For now we just assume the world is perfect and we don't need to handle errors
	// This will be fixed
	return new Promise((resolve) => {
		const eventId = uniqueId();
		const listenName = `${event}:${eventId}`;

		emitNet("removeEventListener", listenName, ...args);

		const eventListener = (data: TResponse) => {
			removeEventListener(listenName, eventListener);
			resolve(data);
		};

		onNet(listenName, eventListener);
	});
}
