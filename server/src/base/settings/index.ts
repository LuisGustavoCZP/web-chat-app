import dotenv from "dotenv";
import { env } from "process";

import { v4 as uuid } from 'uuid';
import { Database, Postgres } from "../clients";

import { CookieOptions } from "express";
import { CorsOptions } from "cors";

import { PoolConfig } from "pg";
import { genSaltSync } from "bcrypt";
import { createDatabase } from "./database";

dotenv.config()

const port = 8080;
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
    origin:["http://127.0.0.1:5500", "http://localhost:5173", "http://192.168.1.101:5173"],
    credentials: true
};

const tokenExpiration = 0;//1000 * 60 * 5 * 1; //1000 * s(60) * m(60) * h(24) * d(30)
const tokenSecret = "24aa3d1f-6524-4f09-8b94-aa32b46d68ed";

createDatabase(database)

export {port, isSsl, uuid, database, corsOptions, databaseConfig, hashSecret, tokenExpiration, tokenSecret};