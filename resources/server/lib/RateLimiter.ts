export class RateLimiter {
	// Only using map here because its syntax is overall nicer then just using an array
	private rateLimits: Map<number, boolean> = new Map();
	private timeBetweenRequests: number;
	constructor(timeBetweenReq: number) {
		this.timeBetweenRequests = timeBetweenReq;
	}

	isPlayerRateLimited(source: number) {
		return !!this.rateLimits.get(source);
	}

	rateLimitPlayer(source: number) {
		this.rateLimits.set(source, true)
		setTimeout(() => {
			this.rateLimits.delete(source);
		}, this.timeBetweenRequests)
	}

}