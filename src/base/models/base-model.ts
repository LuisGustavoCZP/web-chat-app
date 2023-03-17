import { database } from "../settings";
import { v4 as uuid } from "uuid";

export abstract class Model 
{
    id? : string;

    public static async filter (data? : {[key : string] : string}) : Promise<any[]>
    {
        return (await database.filter(this.prototype.tableName, data));
    }

    public static async get (id : string)
    {
        return database.filter(this.prototype.tableName, {id});
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

    public async delete ()
    {
        return database.delete(this.tableName, this.id!);
    }

    protected async create ()
    {
        this.id = uuid();
        return database.insert(this.tableName, this);
    }

    protected async update ()
    {
        return database.update(this.tableName, {id:this.id!}, this);
    }

}