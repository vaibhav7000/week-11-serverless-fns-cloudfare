import { Hono } from "hono";
import UserHono from "./routes/user";
import PostHono from './routes/posts';

const app = new Hono({
    strict: true
}).basePath("api/v1");


// either include base route with small Honos, or provide routing stirng here
app.route('', UserHono);
app.route('/post', PostHono);
