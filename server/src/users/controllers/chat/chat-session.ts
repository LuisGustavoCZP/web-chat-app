import { IWebData, Socket, settings } from "../../../base";

export type SessionAction = (session:ChatSession, socketData?: IWebData) => Promise<void>;

export class ChatSession 
{
    id: string;
    userid: string;
    socket: Socket;
    listeners: Map<string, SessionAction[]>;
    
    constructor (ws: Socket, userid: string)
    {
        this.listeners = new Map<string, SessionAction[]>();
        this.id = settings.uuid();
        this.userid = userid;
        this.socket = ws;
    }

    async trigger (socketData?: IWebData)
    {
        console.log(`\nTrigger Event: ${socketData?.type}\nSession: ${this.id}\nTime:${socketData?.time}\n`)
        if(!socketData?.type) return;
        const ls = this.listeners.get(socketData.type);
        if(ls) ls.forEach(listener => listener(this, socketData));
    }

    addTrigger (event : string, callback: SessionAction)
    {
        if(!this.listeners.has(event))
        {
            this.listeners.set(event, [callback]);
        }
        else this.listeners.get(event)!.push(callback);
    }

    async start ()
    {
        this.socket.on("message", (data: any) => this.onMessage(data));
        this.socket.onclose = (data: any) => this.onClosed(data);

        const msg = {
            type:"session",
            time:new Date(),
            data:{
                sessionid: this.id
            }
        };

        await this.send(msg);
    }

    async send (data: IWebData | undefined)
    {
        this.socket.send(JSON.stringify(data));
    }

    async onMessage (data: string)
    {
        try {
            const msg : IWebData = JSON.parse(data.toString());
            console.log(typeof msg, msg);
            await this.trigger(msg);
        }
        catch (e : any)
        {
            console.log(e.message);
        }
    }

    async onClosed (data: any)
    {
        await this.trigger({type: "closed", time: new Date()});
    }
}