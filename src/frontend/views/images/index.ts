import { Request, Response } from "express";
import fs from "fs";

const logo = fs.readFileSync('./public/images/logo.png');

function sendLogoIcon (req : Request, res : Response)
{
    res.send(logo);
}

export { sendLogoIcon }