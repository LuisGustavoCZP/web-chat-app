import {app} from "../base";
export * as views from "./views";
import { router } from "./routes";

app.router.use(router);