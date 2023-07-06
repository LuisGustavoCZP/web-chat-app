import { Response } from "express";

export class APIResponse
{
    static error (res : Response, data : string)
    {
        //console.log(data)
        let msgInfos = (data as string).split(/\|/gim);
        
        let msgs;
        if(msgInfos.length == 2) msgs = msgInfos[1].replace(/(,$)/gim, "").split(",");
        else 
        {
            msgs = msgInfos[0];
            msgInfos[0] = "500";
        }

        res.status(Number(msgInfos[0])).json({
            data:null,
            messages:msgs
        })
    }

    static sucess (res : Response, data : any, status = 200)
    {
        return res.status(status).json({
            data:data,
            messages:[]
        })
    }
}