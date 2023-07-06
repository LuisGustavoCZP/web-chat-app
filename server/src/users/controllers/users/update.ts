import { Request, Response } from "express";
import { APIResponse } from "../../../base";
import { User } from "../../models";
import { IUser } from "../../interfaces";
import { chatSystem } from "../chat";
import { setAuthCookie } from "../../services";

export async function update (req : Request, res : Response)
{
    delete req.body["id"];
    const userData : Partial<IUser> = req.body;
    const {id} = (req as any).user;

    try 
    {
        const user = (await User.filter({id:{value:id}}))[0];
        /* console.log(user); */
        if(userData.email) user.email = userData.email;
        if(userData.name) user.name = userData.name;
        if(userData.password) user.password = userData.password;
        if(userData.avatar) user.avatar = userData.avatar;

        const response = await user.save();

        chatSystem.broadcast({type:"update-user", time:new Date(), data:{userid:id}});

        const userInfo = setAuthCookie(user, res);

        return APIResponse.sucess(res, response, 200);
    }
    catch (e : any)
    {
        return APIResponse.error(res, (e as Error).message);
    }
}