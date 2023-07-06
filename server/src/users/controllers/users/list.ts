import { Request, Response } from "express";
import { APIResponse } from "../../../base/utils/api-reponse";
import { User } from "../../models";

export async function list (req : Request, res : Response)
{
    const {id} = (req as any).user;

    try 
    {
        const response = await User.filter();
        const userList = response.map(u => 
        {
            return {
                id: u.id,
                name: u.name,
                avatar: u.avatar    
            }
        });
        return APIResponse.sucess(res, userList, 200);
    }
    catch (e : any)
    {
        return APIResponse.error(res, (e as Error).message);
    }
}