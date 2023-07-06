import { IWhere } from "../clients";
import { database } from "../settings";
import { v4 as uuid } from "uuid";

export abstract class Model 
{
    id? : string;
    created_at? : Date;
    updated_at? : Date;
    deleted_at? : Date;

    constructor (data : any)
    {
        if(data.id) this.id = data.id;
        if(data.created_at) this.created_at = data.created_at;
        if(data.updated_at) this.updated_at = data.updated_at;
        if(data.deleted_at) this.deleted_at = data.deleted_at;
    }

    public static async filter (data? : IWhere) : Promise<any[]>
    {
        return (await database.select(this.prototype.tableName, data));
    }

    public static async get (id : string)
    {
        return database.select(this.prototype.tableName, {"id": {value:id}});
    }

    public abstract get tableName () : string;

    public abstract validate () : void;

    public async save ()
    {
        try
        {
            this.validate();
        }
        catch (e)
        {
            throw new Error(`400|${(e as Error).message}`);
        }

        if(!this.id) return await this.create ();
        else return await this.update ();
    }

    public async delete (soft?: boolean)
    {
        return database.delete(this.tableName, {"id": {value:this.id}});
    }

    protected async create ()
    {
        this.id = uuid();
        this["created_at"] = new Date();
        return database.insert(this.tableName, this);
    }

    protected async update ()
    {
        this["updated_at"] = new Date();
        return database.update(this.tableName, this, {"id": {value:this.id}});
    }

}