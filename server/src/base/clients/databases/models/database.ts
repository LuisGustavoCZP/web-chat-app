import { IObject, IWhere } from "../interfaces";

export abstract class Database
{
    public abstract createTable (name: string, columns: string[], extras?: string[]) : Promise<any[]>;

    public abstract createTrigger (name: string, table: string, method: string, procedure: string) : Promise<any[]>;

    public abstract insert (table: string, atributes: IObject): Promise<any[]>;

    public abstract select (table: string, filter?: IWhere): Promise<any[]>;

    public abstract update (table: string, atributes: IObject, filter?: IWhere): Promise<any[]>;

    public abstract delete (table: string, filter?: IWhere): Promise<any[]>;
}