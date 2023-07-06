import { Pool } from "pg";
import { databaseConfig } from "../../../settings";
import { Database } from "../models";
import { IObject, IWhere } from "../interfaces";

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

    public async createTable (name: string, columns: string[], extras?: string[])
    {
        const columnsQuery = columns.map((column) => {
            return `\t${column}`;
        }).join(",\n");

        const extraQuery = extras ? extras.join(";\n") : "";

        const queryString = `
            CREATE TABLE IF NOT EXISTS ${name} (
            ${columnsQuery}
            );
            ${extraQuery}
        `;
        /* console.log(queryString); */
        
        return (await this.query(queryString)).rows;
    }

    public async createTrigger (name: string, table: string, method: string, procedure: string)
    {
        const queryString = `
            CREATE FUNCTION procedure_${name}(integer) 
                RETURNS TRIGGER 
                LANGUAGE PLPGSQL  
                AS
            $$
            BEGIN
                ${procedure}
            END;
            $$

            CREATE TRIGGER ${name}
                AFTER ${method}
                ON ${table}
                EXECUTE PROCEDURE procedure_${name}();
        `;
        return (await this.query(queryString)).rows;
    }

    public query (q : string, values? : any[])
    {
        if(values)
            return this._pool.query(q, values);
        return this._pool.query(q);
    }

    public async insert (table: string, atributes: IObject): Promise<any[]>
    {
        try 
        {
            const keys = Object.keys(atributes as any);
            const indexes = keys.map((value, index) => `$${index+1}`);
            const values = Object.values(atributes as any);
    
            const queryString = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${indexes.join(', ')}) RETURNING *`;
            /* console.log(queryString); */

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

    public async select (table: string, filter?: IWhere): Promise<any[]>
    {
        try 
        {
            const filterEntries = filter ? Array.from(Object.entries(filter)) : null;
            const filterString = filterEntries ? ` WHERE ${filterEntries.map(([key, {type}], i) => `${i > 0 ? ` ${type || "AND"} ` : ""}(${key}=$${1+i})`).join("\n")}` : '';
            const values = filterEntries ? filterEntries.map(([, {value}]) => value) : [];

            const queryString = `SELECT * FROM ${table}${filterString}`;
            /* console.log(queryString); */

            return (await this.query(queryString, values)).rows;
        }
        catch (e)
        {
            const message = (e as Error).message;
            console.log(message);
            throw new Error("503|internal:service temporarily unavailable");
        }
    }

    public async update (table: string, atributes: IObject, filter?: IWhere): Promise<any[]>
    {
        try 
        {
            const filterEntries = filter ? Array.from(Object.entries(filter)) : null;
            const filterString = filterEntries ? ` WHERE ${filterEntries.map(([key, {type}], i) => `${i > 0 ? ` ${type || "AND"} ` : ""}(${key}=$${1+i})`).join("\n")}` : '';
            const values = filterEntries ? filterEntries.map(([, {value}]) => value) : [];
            const vs = values.length;

            const atributesString = `${Object.entries(atributes).map(([key, value], i) => 
            {
                values.push(value);
                return `${key}=$${1+i+vs}`;
            }).join(",")}`;

            const queryString = `UPDATE ${table} SET ${atributesString} ${filterString} RETURNING *`;
            /* console.log(queryString); */

            return (await this.query(queryString, values)).rows;
        }
        catch (e)
        {
            const message = (e as Error).message;
            console.log(message);
            throw new Error("503|internal:service temporarily unavailable");
        }
    }

    public async delete (table: string, filter?: IWhere): Promise<any[]>
    {
        try 
        {
            const filterEntries = filter ? Array.from(Object.entries(filter)) : null;
            const filterString = filterEntries ? ` WHERE ${filterEntries.map(([key, {type}], i) => `${i > 0 ? ` ${type || "AND"} ` : ""}(${key}=$${1+i})`).join("\n")}` : '';
            const values = filterEntries ? filterEntries.map(([, {value}]) => value) : [];

            const queryString = `DELETE FROM ${table} ${filterString} RETURNING *`;
            /* console.log(queryString); */

            return (await this.query(queryString, values)).rows;
        }
        catch (e : any)
        {
            const message = (e).message;
            console.log(message);
            throw new Error("503|internal:service temporarily unavailable");
        }
    }
}

//Object.entries(filter)