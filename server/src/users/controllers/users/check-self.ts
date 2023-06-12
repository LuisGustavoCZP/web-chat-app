import { Request, Response } from "express";
import { APIResponse, settings } from "../../../base";
import jwt from "jsonwebtoken";
import { IUser } from "../../interfaces";
import { User } from "../../models";

const {tokenExpiration, tokenSecret} = settings;

export async function checkSelf (req : Request, res : Response) 
{
    const user : Partial<IUser & {id:string}> = (req as any).user;

    const avatar = (await User.filter({id:{value:user.id}}))[0].avatar;
    user["avatar"] = avatar;

    return APIResponse.sucess(res, user, 200);
}