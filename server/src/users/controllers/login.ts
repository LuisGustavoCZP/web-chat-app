import { Request, Response } from "express"; 
import * as data from '../../base/socket/data';
import { UsernameValidator } from '..//validators';

async function login (req : Request, res : Response) 
{
    const { username } = req.query as { username : string };

    const validator = new UsernameValidator(username);
    if(validator.errors)
    {
        //throw new Error(validator.errors);
        res.redirect(`/`);
        return;
    }

    const userid = data.addUser(validator.data);
    const sessionid = data.addSession(userid);
    res.redirect(`/home/${sessionid}`);
}

export { login };