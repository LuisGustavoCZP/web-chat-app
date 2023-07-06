import { CookieOptions, Request, Response } from "express";
import { APIResponse } from "../../../base";
import { User } from "../../models";

export async function logout (req : Request, res : Response) 
{
    const {id} = (req as any).user;
    try {
        const user = (await User.filter({id:{value:id}}))[0];

        if(!user)
        {
            throw new Error("400|user:not found");
        }

        const cookieOptions : CookieOptions = {secure:true, sameSite:"none"};
        cookieOptions["expires"] = new Date(Date.now());

        res.cookie("auth", "", cookieOptions);
        return APIResponse.sucess(res, "", 200);
    }
    catch (e : any)
    {
        return APIResponse.error(res, (e as Error).message);
    }
}