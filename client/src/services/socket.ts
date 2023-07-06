import { IMessageData, ISocketAction, ISocketData } from "../interfaces";

export class SocketService
{
    socket : WebSocket | null;
    listeners : Map<string, ISocketAction>;
    opened : boolean;

    constructor()
    {
        this.socket = null;
        this.listeners = new Map<string, ISocketAction>();
        this.opened = false;

        console.log("Criando servidor socket!")
    }
    
    async start ()
    {
        console.log("Protocol", window.location.protocol);
        this.socket = new WebSocket(`ws${window.location.protocol == "https"?"s":""}://${window.location.hostname}:8080/ws`, ["https", "http"]);
        this.socket.addEventListener("open", (event) => this.onOpened(event));
        this.socket.addEventListener("close", (event) => this.onClosed(event));
        await new Promise((resolve) => this.listeners.set("opened", resolve));
        //new Promise((resolve) => this.listeners.set("opened", () => resolve))
    }

    stop ()
    {
        if(!this.socket) return;

        this.socket.onopen = null;
        this.socket.onclose = null;
        this.socket.close();
    }

    onOpened (event: Event)
    {
        if(!this.socket) return;

        console.log("abriu servidor");
        this.trigger("started", event);

        this.socket.addEventListener("message", (ev: MessageEvent) => this.onMessage(ev));

        this.opened = true;

        this.trigger("opened", event);
    }

    onClosed (event: any)
    {
        if(!this.socket) return;

        console.log("fechou servidor", event.reason);
        this.trigger("closed", event);

        if(event.code === 1002 && event.reason === "A sessão não é mais válida")
        {
            location.assign('/');
        }

        this.socket.onmessage = null;
    }

    onMessage (event: MessageEvent)
    {
        const data : ISocketData = JSON.parse(event.data);
        console.log("Received", data, typeof event.data);
        this.trigger(data.type, data);
    }

    send (data : any)
    {
        if(!this.socket) return;

        this.socket.send(JSON.stringify(data));
    }

    trigger (type: string, {data, time}: ISocketData | any)
    {
        if(this.listeners.has(type))
        {
            const action = this.listeners.get(type);
            if(action) action(data);
        }
    }
// | IMessageData
    on (type: string, callback : (data : any) => Promise<void>)
    {
        this.listeners.set(type, callback);
    }
}