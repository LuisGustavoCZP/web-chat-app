import { Request, Response } from "express";
import fs from "fs";

const style = fs.readFileSync('./public/styles/style.css');

function sendGlobalStyle (req : Request, res : Response)
{
    res.set('Content-Type', 'text/css');
    res.write(style);
    res.end();
}

export {sendGlobalStyle};