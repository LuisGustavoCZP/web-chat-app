export interface IWebData 
{
    type: string;
    data?: any;
    time: Date;
}

export type SocketData = {id: string, time: Date, data : IWebData};