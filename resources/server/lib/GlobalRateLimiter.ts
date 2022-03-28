export class GlobalRateLimiter {
	private rateLimits: Map<string, Map<number, boolean>> = new Map();
	private timeBetweenRequests: number;
	constructor(timeBetweenReq: number = 250) {
		this.timeBetweenRequests = timeBetweenReq;
	}

	registerNewEvent(event: string) {
		this.rateLimits.set(event, new Map());
	}

	isPlayerRateLimited(event: string, source: number) {
		return !!this.rateLimits?.get(event).get(source);
	}

	rateLimitPlayer(event: string, source: number) {
		let rateLimiter = this.rateLimits.get(event);
		rateLimiter.set(source, true);

		setTimeout(() => {
			rateLimiter.delete(source);
		}, this.timeBetweenRequests)
	}
}