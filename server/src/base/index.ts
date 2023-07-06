import express, { Router } from "express";
import * as settings from "./settings";
import cookieParser from 'cookie-parser';
import cors from "cors";
import { Server } from "./server";
import { router } from "./routes";
import { SocketServer } from "./clients";

export * from "./utils";
export * as validators from "./validators";
export * as models from "./models";
export * from "./clients";
export { router };
export { settings };

class App
{
    app : express.Application;
    server : Server;
    socketServer : SocketServer;
    router : Router;

    constructor ()
    {
        this.app = express();

        this.app.use(cookieParser());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true}));
        this.app.use(cors(settings.corsOptions));

        this.router = router;
        this.app.use("/api", this.router);

        this.server = new Server(this.app, settings);
        this.socketServer = new SocketServer(this.server);
        
        this.server.start();
    }
}

const app = new App ();
(globalThis as any).app = app;

export { app }