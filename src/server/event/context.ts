export type Context = {
	source: number;
};

// We might be able to add a few more things here, like the phone number for example
export function getEventContext(): Context {
	const _source = global.source;

	return {
		source: _source,
	};
}
