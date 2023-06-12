import { Request, Response, NextFunction } from "express";
import { APIResponse, settings } from "../../base";
import { User } from "../models";
import jwt from "jsonwebtoken";

const {tokenExpiration, tokenSecret} = settings;

export async function authPass(req: Request, res: Response, next: NextFunction)
{
    const {auth : token} = req.cookies;
    try 
    { 
        if(!token)
        {
            throw new Error("400|cookie:not found");
        }

        const userInfo : any = jwt.verify(token, tokenSecret);
        delete userInfo["iat"];

        (req as any).user = userInfo;

        next();
    }
    catch (e : any)
    {
        console.log(e);
        return APIResponse.error(res, `404|${(e as Error).message}`);
    }
}