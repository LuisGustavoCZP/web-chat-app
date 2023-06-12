import { Server } from "../../server";
import { IWebData, SocketAction, SocketData, Socket } from "./interfaces";
import WebSocket from "ws";

class SocketServer
{
    server;
    instance;
    //connections: Map<string, SocketClient>;
    listeners: Map<string, SocketAction[]>;

    constructor (server : Server)
    {
        //this.connections = new Map<string, SocketClient>();
        this.listeners = new Map<string, SocketAction[]>();
        this.server = server.instance;
        this.instance = new WebSocket.Server({ server:this.server, path: "/ws" });
        
        this.start ();
    }

    start ()
    {
        this.instance.on('connection', (ws : Socket) => 
        {
            ws.on('message', (data : any) => this.onMessage(ws, data));

            ws.on('close', (data : any) => this.onClose(ws, data));
        
            this.trigger('connected', ws);
        });
    }

    trigger (event: string, ws: Socket, socketData?: IWebData)
    {
        const ls = this.listeners.get(event);
        //console.log(`Triggering ${event}`)
        if(ls) ls.forEach(listener => listener(ws, socketData));
    }

    addTrigger (event : string, callback: SocketAction)
    {
        if(!this.listeners.has(event))
        {
            this.listeners.set(event, [callback]);
        }
        else this.listeners.get(event)!.push(callback);
    }

    removeTrigger (event: string, callback: SocketAction)
    {
        const ls = this.listeners.get(event);
    }

    onConnection (ws : Socket, socketData: IWebData)
    {
        this.trigger("connected", ws, socketData);
    }

    onClose (ws : Socket, socketData: IWebData)
    {   
        this.trigger("disconnected", ws, socketData);
    }

    onError(ws: Socket, err : WebSocket.ErrorEvent)
    {
        console.error(`onError: ${err.message}`);
    }
    
    onMessage(ws: Socket, data: string)
    {
        try {
            const msg : IWebData = JSON.parse(data.toString());
            //console.log(typeof msg, msg);
            this.trigger("message", ws, msg);
        }
        catch (e : any)
        {
            console.log(e.message);
        }
    }
}

export { SocketServer };