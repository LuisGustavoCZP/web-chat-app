import { Database, Postgres } from "../clients";
import { IWhere } from "../clients/databases/interfaces";

export const tables = [
    {
        name: "users",
        columns: [
            "id UUID PRIMARY KEY",
            "email VARCHAR(255) NOT NULL UNIQUE",
            "name VARCHAR(50) UNIQUE NOT NULL",
            "password VARCHAR(255) NOT NULL",
            "avatar TEXT",
            "created_at TIMESTAMP NOT NULL",
            "updated_at TIMESTAMP",
	        "deleted_at TIMESTAMP",
        ],
        extras:[
            "CREATE UNIQUE INDEX IF NOT EXISTS email_index ON users (email)",
            "CREATE UNIQUE INDEX IF NOT EXISTS username_index ON users (name)"
        ],
    },
    {
        name: "privileges",
        columns: [
            "id serial PRIMARY KEY",
            "name VARCHAR ( 50 ) UNIQUE NOT NULL",
            "created_at TIMESTAMP NOT NULL",
        ],
        extras:[
            "CREATE UNIQUE INDEX IF NOT EXISTS privilegename_index ON privileges (name)"
        ],
    },
    {
        name: "groups",
        columns: [
            "id serial PRIMARY KEY",
            "name VARCHAR(50) UNIQUE NOT NULL",
            "avatar TEXT",
            "created_at TIMESTAMP NOT NULL",
        ],
        extras:[
            "CREATE UNIQUE INDEX IF NOT EXISTS groupname_index ON groups (name)"
        ],
    },
    {
        name: "group_user",
        columns: [
            "group_id INT NOT NULL",
            "user_id UUID NOT NULL",
            "privilege_id INT",
            "created_at TIMESTAMP NOT NULL",
            "PRIMARY KEY (group_id, user_id)",
            "FOREIGN KEY (group_id) REFERENCES groups (id)",
            "FOREIGN KEY (user_id) REFERENCES users (id)",
            "FOREIGN KEY (privilege_id) REFERENCES privileges (id)",
        ],
    }
];

export const privileges = [
    { name: "owner" },
    { name: "admin" },
    { name: "moderator" },
];

export async function createDatabase (database : Database)
{
    for(let i = 0; i < tables.length; i++)
    {
        const table = tables[i];
        await database.createTable(table.name, table.columns, table.extras);
    }

    const pg = database as Postgres;

    /* console.log("Create view"); */
    await pg.query(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS users_groups AS
            SELECT g.id, g.name, array_agg(gs.user_id) AS users
            FROM groups g
            INNER JOIN group_user gs 
            ON (g.id = gs.group_id)
            GROUP BY (g.id)
        ;
    `)

    await pg.query(`
        CREATE OR REPLACE FUNCTION procedure_update_users_groups() 
            RETURNS TRIGGER 
            LANGUAGE PLPGSQL  
            AS
            $$
            BEGIN
                REFRESH MATERIALIZED VIEW users_groups;
                RETURN NEW;
            END;
            $$
    `);
    
    await pg.query(`
        CREATE OR REPLACE TRIGGER insert_users_groups
        AFTER INSERT
        ON group_user
        EXECUTE PROCEDURE procedure_update_users_groups();

        CREATE OR REPLACE TRIGGER delete_users_groups
        AFTER DELETE
        ON group_user
        EXECUTE PROCEDURE procedure_update_users_groups();
    `);

    for (let i = 0; i < privileges.length; i++)
    {
        const group = privileges[i];
        const where = {"name": {value: group.name}} as IWhere;
        const data = {name:group.name, created_at:new Date()};

        if((await database.select("privileges", where)).length == 0)
        {
            await database.insert("privileges", data);
        }
    }
    
}