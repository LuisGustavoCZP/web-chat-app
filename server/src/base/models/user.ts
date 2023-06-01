import { SocketClient } from "../socket/socket-client";

class User
{
    id : string; 
    name : string; 
    online : boolean;
    #connections : SocketClient[];
    
    constructor (id: string, name: string, online: boolean)
    {
        this.id = id;
        this.name = name;
        this.online = online;
        this.#connections = []
    }

    
    public get connections() : SocketClient[]
    {
        return this.#connections;
    }
}

export { User }