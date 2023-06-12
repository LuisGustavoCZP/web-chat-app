import {app} from "../base";
export * as controllers from "./controllers";
export * as interfaces from "./interfaces";
export * as models from "./models";
export * as validators from "./validators";
import { router } from "./routes";

app.router.use(router);