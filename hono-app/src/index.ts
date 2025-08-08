import { Hono, HonoRequest } from 'hono'


type Bindings = {
  Token: string;
}

type Variables = {
  user?: User
}

interface User {
  firstname: string;
  lastname: string;
}

const app = new Hono<{
  Bindings: Bindings,
  Variables: Variables,
}>({
  "strict": true
})

app.get('/', (c) => {
  return c.text('Hello Hono!')
})


app.get("/user", context => {
  return context.json({
    msg: "user get route is hit"
  }, 201)
})

app.get("/post", context => {
  const token = context.env.Token;

  context.set("user", {
    firstname: "V",
    lastname: "C"
  })

  const user = context.get("user");

  return context.newResponse(JSON.stringify({
    token, 
    user
  }), 200, {
    "Content-Type": "application/json"
  })
})


// wildcard
app.get("/wild/*/card", context => {
  return context.text("Wild card matching", 202)
})

// any http method but with route as /hello
app.all("/hello", context => {
  const user: User = {
    firstname: "JS",
    lastname: "Developer"
  } 

  context.set("user", user);

  const getUser = context.get("user");

  context.res = getUser; // sets the response object for the current obkect

  return context.json(context.res);
})

// multiple routes, single method
app.on('GET', ['/message', '/message-1'], context => {

  return context.json({
    msg: "multiple routes with single method"
  })
})


// multiple method single route
app.on(['PUT', 'POST'], '/hellops', context => {

  return context.json({

  }, 200, {
    "Content-Type": "application/json"
  })
})


app.get('/route-params/:id', context => {
    // we get the body directly
    // query-params, route-params, are fetched using context.req.params(name);
    const id = context.req.param("id");

    return context.json({
      msg: id,
    })
})

// optional route params routes
app.get("/route/id?", context => {
  const id = context.req.param("id");

  return id ? context.text(`Your id is ${id}`) : context.text("You does not pass any id");
})

// routes params but with regex that checking
app.get('/route/:filename{.+\\.png}', context => {
  const filename = context.req.param("filename");

  return context.json({
    msg: `How are you, you have done ${filename} that handles with png`
  })
})

app.all('/route/:date{[0-9]{8}}', context => {
  const date = context.req.param("date"); // accepts dates with 8 digits

  return context.text("You have send a valid date", 201, {
    "Content-Type": "text/plain"
  })
})


// chaining of routes with hono
app
  .get('/chaining-get', context => context.newResponse("chaining get", 200, {
    "Content-Type": "text/plain"
  }))
  .post()
  .put()
  .delete()


// global catch middleware in hono 
app.onError((err, context) => {
  if(err) {
    return context.text("Something up with the server", 500, {
      "Content-Type": "application/json"
    })
  }
})


// not found route handler
app.notFound(context => {
  return context.newResponse(JSON.stringify({
    msg: "Route does not found"
  }), 404, {
    "Content-Type": "application/json"
  })
})

export default app
/*

  hono works on the cloudflare workersruntime, fastly, lamda, deno, bun, vercel, netifly, normal node js (using server) ( a web api based runtime )

  context holds every method / properties that are related to the request and response, these can fetched using context["name"]

  when using hono we does not care about the deployment it is the cloudflare worker, wrangler locally that handles the process, just write the logic of the application export the application logic and hono based on the cloudflare workers runtime will auto-matically handle things.

  Hono is build on the top of cloudflare workers
  export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return app.fetch(request, env, ctx)
  },


  "get" and "set" methods of context are used to set and get the variables inside the context, use them with creating special generics
}

*/
