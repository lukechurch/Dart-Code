import * as http from "http";
import * as vs from "vscode";
import { WebClient } from "./fetch";

export class IDGReporter {
	constructor() {
		this.wc = new WebClient("IDG");

		const port = 9991;

		const server = http.createServer((request: http.IncomingMessage, response: http.ServerResponse) => {
			// if (request.url is not string) return;
			const reqUrl = decodeURI(request.url!);
			const verb = reqUrl?.split("?")[1].split("=")[0];

			if (verb === "open") {
				const target = reqUrl?.substring("/open?=".length);
				response.write("opening: ");
				response.write(target);
				const uri = vs.Uri.file(target);
				vs.commands.executeCommand("vscode.open", uri);
			} else {
				response.write("Unknown command");
				response.write(reqUrl);
			}

		  response.end("Done!"); // let uri = Uri.file('/some/path/to/folder');
		});
		server.listen(port, () => {
		//   if (error) {
			// console.log(error);
		//   } else {
			console.log(`Server listening on port ${port}`);
		//   }
		});

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
