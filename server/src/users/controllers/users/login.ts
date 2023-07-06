import { Request, Response } from "express";
import { APIResponse } from "../../../base";
import { IUser } from "../../interfaces";
import { User } from "../../models";
import { setAuthCookie } from "../../services";


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
        
        const userInfo = setAuthCookie(user, res);

        return APIResponse.sucess(res, {...userInfo, avatar:user.avatar}, 200);
    }
    catch (e : any)
    {
        return APIResponse.error(res, (e as Error).message);
    }
}

export { login };