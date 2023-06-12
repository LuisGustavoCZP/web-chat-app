export interface ISocketData 
{
    type: string;
    time: Date;
    data: IMessageData;
}

export interface IMessageData 
{
    text: string;
    owner: string;
    target?: string;
    time: Date;
}