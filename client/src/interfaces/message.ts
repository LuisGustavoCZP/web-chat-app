import { IOther } from "./user-other";

export interface IMessage 
{
    text: string;
    owner: IOther;
    target?: IOther;
    time: Date;
}