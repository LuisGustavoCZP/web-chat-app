import { Pool } from "pg";
import { databaseConfig } from "../../../settings";
import { Database } from "../models";

export class Postgres extends Database
{
    private _pool: Pool;

    public constructor ()
    {
        super();
        this._pool = new Pool(databaseConfig);
    }

    public get pool ()
    {
        return this._pool;
    }

    public query (q : string, values? : any[])
    {
        if(values)
            return this._pool.query(q, values);
        return this._pool.query(q);
    }

    public async insert (table: string, atributes: any): Promise<any[]>
    {
        try 
        {
            const keys = Object.keys(atributes as any);
            const indexes = keys.map((value, index) => `$${index+1}`);
            const keystring = keys.join(', ');
            const indexstring = indexes.join(', ');
            const values = Object.values(atributes as any);
    
            const queryString = `INSERT INTO ${table} (${keystring}, created_at) VALUES (${indexstring}, now()) RETURNING *`;
            //console.log(queryString);

            return (await this.query(queryString, values)).rows[0];
        }
        catch (e)
        {
            const message = (e as Error).message;
            if(message.includes("violates unique constraint"))
            {
                const uniques = message.match(/".*"$/gim);
                const msg = uniques?.map(value => 
                {
                    const parts = value.split("_");
                    return `internal: ${parts[1]} must be unique`; 
                }).join(",");

                throw new Error(`503|${msg}`);
            }
            else console.log(message);
            throw new Error("503|internal:service temporarily unavailable");
        }
    }

    public async filter (table: string, filter?: any): Promise<any[]>
    {
        try 
        {
            const filterString = filter ? ` WHERE ${Object.entries(filter as any).map((value) => `(${value[0]}='${value[1]}')`).join(",")}` : '';

            const queryString = `SELECT * FROM ${table}${filterString}`;
            //console.log(queryString);

            return (await this.query(queryString)).rows;
        }
        catch (e)
        {
            const message = (e as Error).message;
            console.log(message);
            throw new Error("503|internal:service temporarily unavailable");
        }
    }

    public async update (table: string, filter: any, atributes: any): Promise<any[]>
    {
        try 
        {
            const filterString = `WHERE ${Object.entries(filter as any).map((value) => `${value[0]}='${value[1]}'`).join(",")}`;
            const atributesString = `${Object.entries(atributes as any).map((value) => `${value[0]}='${value[1]}'`).join(",")}`;

            const queryString = `UPDATE ${table} SET updated_at=now(), ${atributesString} ${filterString} RETURNING *`;
            //console.log(queryString);

            return (await this.query(queryString)).rows;
        }
        catch (e)
        {
            const message = (e as Error).message;
            console.log(message);
            throw new Error("503|internal:service temporarily unavailable");
        }
    }

    public async delete (table: string, id : string): Promise<any[]>
    {
        //const queryString = `UPDATE ${table} SET deleted_at=now()${deleted_by==''?'':`${deletedName}_by=$1`}${filterstring==''?'':' WHERE '+filterstring} RETURNING *`;
        return [];
    }
}