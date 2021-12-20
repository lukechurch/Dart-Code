import * as http from "http";
import { WebClient } from "./fetch";

export class IDGReporter {
	constructor() {
		this.wc = new WebClient("IDG");
	}

	private wc : WebClient;

	public async report(source: string, eventString: string) {
		const time = `[${(new Date()).toLocaleTimeString()}]`;
		const s = `IDG report: ${time} ${source} ${eventString}`;
		console.log(s);
		const uri = encodeURI(`http://127.0.0.1:9999/idg?arg=${s}`);
		console.log(uri);
		const response = await this.wc.fetch(uri);
		console.log(response);
		// console.log(http.get(uri));
		// console.log("Request sent");

		console.log("About to call post");
		// const r = await this.fetchHttp("localhost", "9999", "/");

		console.log("Done");


		// const options: http.RequestOptions = {
		// 	headers: {
		// 		"Content-Type": "application/x-www-form-urlencoded",
		// 	},
		// 	hostname: "127.0.0.1",
		// 	method: "GET",
		// 	path: "/idg?",
		// 	port: 9999,
		// };

		// await new Promise<void>((resolve) => {
		// 	try {
		// 		const req = http.request(options, (resp) => {
		// 			if (!resp || !resp.statusCode || resp.statusCode < 200 || resp.statusCode > 300) {
		// 				console.log(`Failed to send analytics ${resp && resp.statusCode}: ${resp && resp.statusMessage}`);
		// 			}
		// 			resolve();
		// 		});
		// 		req.write("some data");
		// 		req.on("error", (e) => {
		// 			console.log(e);
		// 			resolve();
		// 		});
		// 		req.end();
		// 	} catch (e) {
		// 		console.log(e);
		// 		resolve();
		// 	}
		// });

	}

	private fetchHttp(hostname: string | undefined, port: string | undefined, path: string | undefined, headers: http.OutgoingHttpHeaders = {}): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			const options: http.RequestOptions = {
				headers: {
					...headers,
					"User-Agent": "IDG/0.1",
				},
				hostname,
				method: "POST",
				path,
				port,
			};

			const req = http.request(options, (resp) => {
				console.log(`response: ${resp}`);
				if (!resp || !resp.statusCode || resp.statusCode < 200 || resp.statusCode > 300) {
					reject({ message: `Failed to get ${path}: ${resp && resp.statusCode}: ${resp && resp.statusMessage}` });
				} else {
					const chunks: string[] = [];
					resp.on("data", (b) => chunks.push(b.toString()));
					resp.on("end", () => {
						const data = chunks.join("");
						resolve(data);
					});
				}
			});
			req.end();
		});
	}
}

export const reporter = new IDGReporter();
