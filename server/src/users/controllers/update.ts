import { Request, Response } from "express";
import { APIResponse } from "../../base/utils/api-reponse";
import { User } from "../models";
import { IUser } from "../interfaces";

export async function update (req : Request, res : Response)
{
    const {id} = req.body;
    const userData : Partial<IUser> = req.body;
    try {
        const user = (await User.filter({id:id}))[0];
        console.log(user);
        if(userData.email) user.email = userData.email;
        if(userData.name) user.name = userData.name;
        if(userData.password) user.password = userData.password;
        const response = await user.save();
        return APIResponse.sucess(res, response, 200);
    }
    catch (e : any)
    {
        console.log(e);
        return APIResponse.error(res, (e as Error).message);
    }
}