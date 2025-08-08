import { Context, Hono } from "hono";

// this will apply /users to all the routes
let requestCount: number = 0;

type Bindings = {
    token: string;
}

// these variables can be get and set using context.set and context.get
type Variables = {
    user?: {
        firstname: string;
        lastname: string;
        age: number;
    },
    count: number;
}

const app = new Hono<{
    Bindings: Bindings,
    Variables: Variables;
}>({
    strict: true,
}).basePath("/users");

// declaring middlware that will run for all routes

async function countRequest(context: Context, next: () => Promise<void>) {
    requestCount++;
    next();
}

app.use(countRequest);


app.get("/all", context => context.text("You have all users", 200, {
    "Content-Type": "text/plain"
}))

app.get("/:id", context => {
    const id: string = context.req.param("id");

    return context.json({
        msg: "You have passed valid id " + id
    })
})

app.post("/new", context => {
    
    const user = {
        firstname: "VC",
        lastname: "ch",
        age: 23
    }

    context.set("user", user);

    return context.json(context.get("user"), 201, {
        "Content-Type": "application/json"
    })

})


app.get("*", context => {
    return context.text("You have hit wild card matching with users");
})

export default app;