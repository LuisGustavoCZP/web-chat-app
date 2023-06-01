import { Request, Response } from "express";
import fs from "fs";

const emojis = JSON.parse(fs.readFileSync('./data/emojis.json', {encoding:"utf-8"}));

function sendEmojis (req : Request, res : Response)
{
    res.json(emojis);
}

export { sendEmojis }
