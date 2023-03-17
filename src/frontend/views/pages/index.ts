import { Request, Response } from "express";
import fs from "fs";
import { SessionIDValidator } from "../../../users/validators/sessionid-validator";

function sendLoginPage (req : Request, res : Response) 
{
    const loginPage = fs.readFileSync('./public/login.html');

    res.writeHead(200);
    res.write(loginPage);
    res.end();
}

function sendHomePage (req : Request, res : Response) 
{
    const { sessionid } = req.params;

    const validator = new SessionIDValidator(sessionid);
    if(validator.errors)
    {
        //throw new Error(validator.errors);
        res.redirect(`/`);
        return;
    }

    const homePage = fs.readFileSync('./public/index.html');

    /* res.header("Feature-Policy: microphone 'self' *"); */
    res.writeHead(200);
    res.write(homePage);
    res.end();
}

export { sendLoginPage, sendHomePage }