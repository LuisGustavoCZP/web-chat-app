import { CookieOptions, Request, Response } from "express";
import { APIResponse, settings } from "../../../base";
import { IUser } from "../../interfaces";
import { User } from "../../models";
import jwt from "jsonwebtoken";
//import * as data from '../../base/socket/data';

const {tokenExpiration, tokenSecret} = settings;

async function login (req : Request, res : Response) 
{
    const {email, password} : Partial<IUser> = req.body;
    try { 
        if(!email)
        {
            throw new Error("400|email:is empty");
        }
        else
        if(!password)
        {
            throw new Error("400|password:is empty");
        }

        const user = (await User.filter({email:{value:email}}))[0];

        if(!user)
        {
            throw new Error("400|user:not found");
        }
        
        if(!await user.passwordCheck(password))
        {
            throw new Error("400|user:password does't match");
        }
        /* const {id, name, email} = user; */
        const userInfo = {id:user.id, name:user.name, email:user.email};
        const token = jwt.sign(userInfo, tokenSecret);

        const cookieOptions : CookieOptions = {secure:true, sameSite:"none"};
        if(tokenExpiration) cookieOptions["expires"] = new Date(Date.now()+tokenExpiration);

        res.cookie("auth", token, cookieOptions);

        return APIResponse.sucess(res, {...userInfo, avatar:user.avatar}, 200);
    }
    catch (e : any)
    {
        return APIResponse.error(res, (e as Error).message);
    }
}

export { login };