import { Server } from "../server";
import { SocketClient } from "./socket-client";
import WebSocket from "ws";

class SocketServer
{
    server;
    wss;
    clients = new Map<string, SocketClient>();

    constructor (server : Server)
    {
        this.server = server.instance;
        this.wss = new WebSocket.Server({ server:this.server });
        
        this.start ();
    }

    start ()
    {
        this.wss.on('connection', (ws : WebSocket.WebSocket) => 
        {
            const client = new SocketClient(ws, this);
            this.createClient(client);
        });
    }

    createClient (client : SocketClient)
    {
        this.clients.set(client.id, client);
    }

    removeClient (client : SocketClient)
    {
        this.clients.delete(client.id);
    }
}

export { SocketServer };