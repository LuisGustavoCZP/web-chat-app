import dotenv from "dotenv";
import { env } from "process";

import { v4 as uuid } from 'uuid';
import { Database, Postgres } from "../clients";

import { CookieOptions } from "express";
import { CorsOptions } from "cors";

import { PoolConfig } from "pg";
import { genSaltSync } from "bcrypt";

dotenv.config()

const port = Number(env.PORT) || 3000;
const isSsl = env.SSL ? env.SSL == "true" : false;

const hashSecret = genSaltSync(10);

const databaseConfig : PoolConfig = 
{
    host:env.DB_HOST || "localhost",
    port:Number(env.DB_PORT) || 5432,
    database:env.DB_DATABASE || "webchat_db",
    user:env.DB_USER || "test",
    password:env.DB_PASSWORD || "1234"
}

const database : Database = new Postgres();

const corsOptions : CorsOptions = 
{
    origin:["http://127.0.0.1:5500"],
    credentials: true
};

export {port, isSsl, uuid, database, corsOptions, databaseConfig, hashSecret};