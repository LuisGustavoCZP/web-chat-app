import * as data from './data';
import { uuid } from "../settings";
import { WebSocket } from "ws";
import { SocketServer } from './socket-server';

class SocketClient 
{
    server : SocketServer;
    ws : WebSocket;
    id : string;
    userid! : string;

    constructor (ws : any, server : SocketServer)
    {
        this.ws = ws;
        this.id = uuid();
        this.server = server;
        this.start ();
    }

    receiveSession (resp : any)
    {
        //console.log(resp);
        const session = data.sessions.get(resp.id);
        if(!session) 
        {
            this.ws.close(1002, "A sessão não é mais válida");//
            return;
        }

        this.userid = session.userid;
        console.log(`Client connected with id:${this.userid}.`);

        const initialSetup = {
            type: "setup",
            data: this.userid
        };

        this.ws.send(JSON.stringify(initialSetup));

        const user = data.users.get(this.userid);
        if(!user) return;

        data.connect(this.userid, this);
    };

    receiveMessage (msg : any)
    {
        const user = data.users.get(this.userid);
        if(!user) return;

        if(msg["id"]) delete msg["id"];
        msg.id = this.userid;
        msg.username = user.name;

        //console.log(msg);
        if(!msg.private)
        {
            data.broadcast(msg);
        }
        else
        {
            msg.type = "private";
            data.sendTo(msg.private, msg);
            data.sendTo(msg.id, msg);
        }
        
    };

    send (info : any)
    {
        const infoString = JSON.stringify(info);
        if(this.ws)
        {
            this.ws.send(infoString);
        }
    }

    events : {[key : string] : (msg : any) => void} = {
        "message": (msg : any) => this.receiveMessage(msg),
        "audio": (msg : any) => this.receiveMessage(msg),
        "session": (resp : any) => this.receiveSession(resp)
    }

    start ()
    {
        this.ws.on('message', (resp : any) => 
        {
            try {
                const msg = JSON.parse(resp.toString());
                const event = this.events[msg.type];
                if(event) event(msg);
            }
            catch (e)
            {
                console.log(e);
            }
        });

        this.ws.on('close', () => 
        {
            data.disconnect(this.userid, this.id);
            console.log(`Client disconnected with id:${this.id}.`);
        });
    }

    close ()
    {
        this.ws.close();
    }
}

export { SocketClient };