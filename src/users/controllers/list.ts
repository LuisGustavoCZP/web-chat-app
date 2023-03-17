import { Request, Response } from "express";
import { APIResponse } from "../../base/utils/api-reponse";
import { User } from "../models";

export async function list (req : Request, res : Response)
{
    try {
        const response = await User.filter();
        return APIResponse.sucess(res, response, 201);
    }
    catch (e : any)
    {
        return APIResponse.error(res, (e as Error).message);
    }
}