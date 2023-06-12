import { Request, Response } from "express";
import { chatSystem } from "./chat-system";
import { IUser } from "../../interfaces";
import { APIResponse } from "../../../base";

export async function createSession(req : Request, res : Response) 
{
    const user : Partial<IUser & {id:string}> = (req as any).user;

    /* const session = await chatSystem.createSession(user.id!); */
    
    return APIResponse.sucess(res, {id: user.id}, 200);
}