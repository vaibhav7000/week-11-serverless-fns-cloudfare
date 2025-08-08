import { Hono } from "hono";

// currently no need to provide basePath because we have provided it where routing is creating, if we does not provide the path then basePath should be provided in each route that should be same
const app = new Hono({
    strict: true
})


app.get('/all', context => {
    return context.json({
        msg: "All posts are send"
    })
})

app.get('/:postname/:id', context => {
    const {postname, id} = context.req.param();

    return context.text(`${postname} is the name and id is ${id}`);
})

export default app;