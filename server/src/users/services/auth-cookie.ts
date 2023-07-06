import { CookieOptions, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models";
import { settings } from "../../base";

const {tokenExpiration, tokenSecret} = settings;

export function setAuthCookie (user : User, res: Response)
{
    const userInfo = {id:user.id, name:user.name, email:user.email};
    const token = jwt.sign(userInfo, tokenSecret);

    const cookieOptions : CookieOptions = {secure:true, sameSite:"none"};
    if(tokenExpiration) cookieOptions["expires"] = new Date(Date.now()+tokenExpiration);

    res.cookie("auth", token, cookieOptions);

    return userInfo;
}