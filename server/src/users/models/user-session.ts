import { Socket } from "../../base";

class UserSession
{
    id : string; 
    name : string; 
    online : boolean;
    #connections : Socket[];
    
    constructor (id: string, name: string, online: boolean)
    {
        this.id = id;
        this.name = name;
        this.online = online;
        this.#connections = []
    }

    
    public get connections() : Socket[]
    {
        return this.#connections;
    }
}

export { UserSession }