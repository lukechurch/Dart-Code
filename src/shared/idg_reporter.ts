
export class IDGReporter {
	constructor() {
		// TODO as needed
	}

	public report(source: string, eventString: string) {

		const time = `[${(new Date()).toLocaleTimeString()}]`;
		console.log(`IDG report: ${time} ${source} ${eventString}`);
	}
}

export const reporter = new IDGReporter();
