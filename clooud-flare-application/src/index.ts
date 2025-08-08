/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */


export default {
	// this "fetch" function is used by the cloudflare, that at end creates the http server and is hosted on the cloudflare serverless backends,

	// all the logic of routing we have to write ourselves inside the single fetch or deletgate that into multiple functions but at the end we have to write lot of code our-selves, 
	
	// when creating the application using "serverless backend" we does not take care of the deployment process like in express app.port(portNumber), we provide the logic of our application to the runtime and it handles the deployment process

	// here comes "Hono" that provides cleaner sytnax to create http servers, just like express based on nodeJS, hono is based on the workers runtime


	// Hono inherits the code of cloudflare workers and provide an easy syntax to create the backend / http servers application
	async fetch(request: Request, env, ctx): Promise<Response> {
		console.log(request.body);
		console.log(request.headers);
		const url: URL = new URL(request.url);

		console.log(url);

		if(request.method === "GET" && url.pathname === "/message") {
			return  new Response("Your are getting the get method");
		} 

		if(request.method === "GET" && url.pathname === "/user") {
			return Response.json({
				msg: "you are on the users pathname"
			})
		}

		switch (request.method) {
			case "GET": 
				return Response.json({
					text: "Sending JSON object as response"
				})
			case "POST":
				return new Response("Post Hello");
			default:
				return new Response("Get Hello");
		}
	}
} satisfies ExportedHandler<Env>;

/*

	"cloudflare" serverless backends uses "cloudflare workers" a new run-time provided by the cloudflare that handles the deployment process of the application.

	"wrangler" is a tool that simulates the cloudflare workers runtime locally ( => can start the application locally ) + can be used to deploy the application on the cloudflare

	When building the application using the cloudflare as serverless backend we have to use boiler plate code that cloud-wokers / wrangler uses => know have to write the code / logic according to the cloudflare workers 

	By default cloudflare workers syntax does not provide an boiler plate code to write routing logic / we have to write a lot of code ourselves, Here comes "Hono", that under the hood converts the clearner sytnax to the cloudflare workers syntax and hence the applicaiton is easy to maintain + deploy using the serverless backends


	When building the application using "cloudflare serverless backend" we have bring the "wrangler" in house which simulates the cloudflare workers run-time locally + helps to deploy the code over the internet

*/
