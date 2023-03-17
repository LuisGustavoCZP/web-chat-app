import express from "express";
import * as settings from "./settings";
import cookieParser from 'cookie-parser';
import cors from "cors";
import { SocketServer } from "./socket";
import { Server } from "./server";
import { router } from "./routes";

export * as validators from "./validators";
export * as models from "./models";
export * as client from "./clients";
export { router };
export { settings };

class App
{
    app : express.Application;
    server : Server;
    socketServer : SocketServer;

    constructor ()
    {
        this.app = express();

        this.app.use(cookieParser());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true}));
        this.app.use(cors(settings.corsOptions));

        this.app.use(router);

        this.server = new Server(this.app, settings);
        this.socketServer = new SocketServer(this.server);
        
        this.server.start();
    }
}

const app = new App ();

export { app }