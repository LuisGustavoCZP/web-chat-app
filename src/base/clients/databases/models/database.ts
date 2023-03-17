export abstract class Database
{
    public abstract insert (table: string, atributes: any): Promise<any[]>;

    public abstract filter (table: string, filter?: any): Promise<any[]>;

    public abstract update (table: string, filter: any, atributes: any): Promise<any[]>;

    public abstract delete (table: string, id : string): Promise<any[]>;
}