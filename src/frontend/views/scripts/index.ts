import { Request, Response } from "express";
import fs from "fs";

const scriptFiles : {[key : string] : any} = loadAllScripts ();

function loadAllScripts ()
{
    const filePath = `./public/scripts/`;
    if(fs.existsSync(filePath))
    {
        const dirFiles = fs.readdirSync(filePath);

        const fileMap = dirFiles.map(file => 
        {
            return [file, fs.readFileSync(`${filePath}${file}`)];
        });

        return Object.fromEntries(fileMap);
    }
    
    return {};
}

function loadScript (name : string)
{
    return scriptFiles[name];
}

function sendScript (req : Request, res : Response) 
{
    const fileName = req.params["script"];
    if(!fileName) {res.end(); return;}
    const match = fileName.match(/^((\w{1,}-){0,}\w{1,})(\.js)$/gim);
    if(!match) {res.end(); return;}
    const scriptFile = loadScript(fileName);
    if(!scriptFile) { res.writeHead(404); res.end(); return; }

    res.set('Content-Type', 'text/javascript');
    res.write(scriptFile);
    res.end();
}

export {
    sendScript
}