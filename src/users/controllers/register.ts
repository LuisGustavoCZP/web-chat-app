import { Request, Response } from "express";
import { APIResponse } from "../../base/utils/api-reponse";
import { User } from "../models";
import { IUser } from "../interfaces";

export async function register (req : Request, res : Response)
{
    const userData : IUser = req.body;
    try 
    {
        const newUser = new User(userData);
        const response = await newUser.save();
        return APIResponse.sucess(res, response, 201);
    }
    catch (e : any)
    {
        return APIResponse.error(res, (e as Error).message);
    }
}